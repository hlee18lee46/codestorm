import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import bs58 from "bs58";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
} from "@metaplex-foundation/umi";
import {
  mplTokenMetadata,
  createNft,
} from "@metaplex-foundation/mpl-token-metadata";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      recipientWallet,
      userId = "han123",
      badgeName = "Algorithms Apprentice",
      topic = "Algorithms",
      completedLessons = 5,
    } = body;

    if (!recipientWallet) {
      return NextResponse.json(
        { success: false, error: "recipientWallet is required" },
        { status: 400 }
      );
    }

    const pinataJwt = process.env.PINATA_JWT!;
    const pinataGateway = process.env.PINATA_GATEWAY!;
    const solanaPrivateKey = process.env.SOLANA_PRIVATE_KEY_BASE58!;
    const rpcUrl =
      process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";

    const normalizedGateway = pinataGateway.replace(/\/+$/, "");

    const metadata = {
      name: badgeName,
      symbol: "STUDY",
      description: `StudyChain AI achievement badge for completing ${completedLessons} lessons in ${topic}.`,
      seller_fee_basis_points: 0,
      image:
        "https://placehold.co/600x600/png?text=StudyChain+AI+Badge",
      attributes: [
        { trait_type: "App", value: "StudyChain AI" },
        { trait_type: "User ID", value: userId },
        { trait_type: "Topic", value: topic },
        { trait_type: "Completed Lessons", value: completedLessons },
        { trait_type: "Badge", value: badgeName },
        { trait_type: "Created At", value: new Date().toISOString() },
      ],
      properties: {
        category: "image",
      },
    };

    const pinataJsonRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          Authorization: `Bearer ${pinataJwt}`,
          "Content-Type": "application/json",
        },
      }
    );

    const metadataCID = pinataJsonRes.data.IpfsHash;
    const metadataUri = `${normalizedGateway}/${metadataCID}`;

    const secretKey = bs58.decode(solanaPrivateKey);

    const umi = createUmi(rpcUrl).use(mplTokenMetadata());
    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);

    umi.use(keypairIdentity(umiKeypair));

    const mint = generateSigner(umi);

    const result = await createNft(umi, {
      mint,
      name: badgeName,
      symbol: "STUDY",
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(0),
      tokenOwner: publicKey(recipientWallet),
    }).sendAndConfirm(umi);

    const mintAddress = mint.publicKey.toString();
    const signature = bs58.encode(result.signature);

    return NextResponse.json({
      success: true,
      badgeName,
      mintAddress,
      signature,
      metadataUri,
      explorer: `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`,
    });
  } catch (error: any) {
    console.error("Mint NFT error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}