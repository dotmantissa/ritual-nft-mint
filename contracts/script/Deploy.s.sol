// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {RitualGenesis} from "../src/RitualGenesis.sol";

/**
 * @title Deploy
 * @notice Deploys RitualGenesis to Ritual Chain (Chain ID 1979).
 *
 * Usage:
 *   forge script script/Deploy.s.sol:Deploy \
 *     --rpc-url https://rpc.ritualfoundation.org \
 *     --broadcast \
 *     -vvvv
 *
 * After deployment:
 *   1. Copy the deployed address
 *   2. Update NEXT_PUBLIC_NFT_CONTRACT in frontend/.env.local
 *   3. Optionally verify: forge verify-contract --chain 1979 ...
 */
contract Deploy is Script {
    function run() external {
        uint256 deployerPK = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPK);

        // Start with a placeholder base URI — update after IPFS upload
        string memory baseURI = "ipfs://bafybeidqgl3nbnizulf52qziqoliitvzzot42qlcgkb6ithrkgsozi63he/";

        RitualGenesis nft = new RitualGenesis(baseURI);

        console.log("RitualGenesis deployed to:", address(nft));
        console.log("Deployer:", vm.addr(deployerPK));
        console.log("Max supply:", nft.MAX_SUPPLY());
        console.log("Mint price:", nft.MINT_PRICE());

        vm.stopBroadcast();
    }
}
