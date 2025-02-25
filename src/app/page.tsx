"use client";

import { NftMint } from "@/components/nft-mint";
import {
  defaultChainId,
  presaleContractAddress,
  defaultTokenId,
} from "@/lib/constants";
import { client } from "@/lib/thirdwebClient";
import { defineChain, getContract, toEther, toTokens } from "thirdweb";
import { getContractMetadata } from "thirdweb/extensions/common";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { getActiveClaimCondition as getActiveClaimCondition20 } from "thirdweb/extensions/erc20";
import { useReadContract } from "thirdweb/react";

// This page renders on the client.
// If you are looking for a server-rendered version, checkout src/ssr/page.tsx
export default function Home() {
  const tokenId = defaultTokenId;
  const chain = defineChain(defaultChainId);
  const contract = getContract({
    address: presaleContractAddress,
    chain,
    client,
  });
  const contractMetadataQuery = useReadContract(getContractMetadata, {
    contract,
  });

  const claimCondition20 = useReadContract(getActiveClaimCondition20, {
    contract,
  });

  const displayName = contractMetadataQuery.data?.name;

  const description = contractMetadataQuery.data?.description;

  const loadingClaimConditions = claimCondition20.isLoading || claimCondition20.isRefetching
  const priceInWei = claimCondition20.data?.pricePerToken;
  const supplyClaimed = claimCondition20.data?.supplyClaimed;
  const totalSupply = claimCondition20.data?.maxClaimableSupply;
  const currency = claimCondition20.data?.currency;

  console.log("Supply claimed", supplyClaimed, totalSupply);
  const currencyContract = getContract({
    address: currency || "",
    chain,
    client,
  });

  const currencyMetadata = useReadContract(getCurrencyMetadata, {
    contract: currencyContract,
    queryOptions: { enabled: !!currency },
  });

  const currencySymbol = currencyMetadata.data?.symbol || "";

  const pricePerToken =
    currencyMetadata.data && priceInWei !== null && priceInWei !== undefined
      ? Number(toTokens(priceInWei, currencyMetadata.data.decimals))
      : 0.0001;

  return (
    <NftMint
      contract={contract}
      displayName={displayName || ""}
      contractImage={contractMetadataQuery.data?.image || ""}
      description={description || ""}
      currencySymbol={currencySymbol}
      pricePerToken={pricePerToken}
      isERC1155={false}
      isERC721={false}
      tokenId={tokenId}
      totalSupply={totalSupply!}
      supplyClaimed={supplyClaimed!}
	  loadingClaimConditions={loadingClaimConditions}
    />
  );
}
