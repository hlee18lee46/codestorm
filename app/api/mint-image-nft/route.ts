import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";
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
    const form = await req.formData();

    const recipientWallet = form.get("recipientWallet") as string | null;
    const image = form.get("image") as File | null;

    const badgeName =
      (form.get("badgeName") as string | null) || "StudyChain AI Badge";

    const topic =
      (form.get("topic") as string | null) || "Algorithms";

    const completedLessons =
      (form.get("completedLessons") as string | null) || "5";

    if (!recipientWallet) {
      return NextResponse.json(
        { success: false, error: "recipientWallet is required" },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { success: false, error: "image is required" },
        { status: 400 }
      );
    }

    const pinataJwt = process.env.PINATA_JWT!;
    const pinataGateway =
      process.env.PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs";
    const solanaPrivateKey = process.env.SOLANA_PRIVATE_KEY_BASE58!;
    const rpcUrl =
      process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";

    const normalizedGateway = pinataGateway.replace(/\/+$/, "");

    // 1. Upload image to Pinata/IPFS
    const buffer = Buffer.from(await image.arrayBuffer());

    const uploadForm = new FormData();
    uploadForm.append("file", buffer, {
      filename: image.name || "studychain-badge.png",
      contentType: image.type || "image/png",
    });

    const pinataFileRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      uploadForm,
      {
        headers: {
          ...uploadForm.getHeaders(),
          Authorization: `Bearer ${pinataJwt}`,
        },
      }
    );

    const imageCID = pinataFileRes.data.IpfsHash;
    const imageUrl = `${normalizedGateway}/${imageCID}`;

    // 2. Upload NFT metadata to Pinata/IPFS
    const metadata = {
      name: badgeName,
      symbol: "STUDY",
      description: `StudyChain AI achievement NFT for ${topic}.`,
      seller_fee_basis_points: 0,
      image: imageUrl,
      properties: {
        files: [
          {
            uri: imageUrl,
            type: image.type || "image/png",
          },
        ],
        category: "image",
      },
      attributes: [
        { trait_type: "App", value: "StudyChain AI" },
        { trait_type: "Topic", value: topic },
        { trait_type: "Completed Lessons", value: completedLessons },
        { trait_type: "Created At", value: new Date().toISOString() },
      ],
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

    // 3. Mint Solana NFT
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
      imageUrl,
      metadataUri,
      explorer: `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`,
    });
  } catch (error: any) {
    console.error("Mint image NFT error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}