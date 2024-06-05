import { ethers, upgrades } from "hardhat";

async function main() {
    const box = await ethers.getContractFactory("Box");
    const boxV2 = await ethers.getContractFactory("BoxV2");
    const boxProxy = await upgrades.deployProxy(box, { kind: "uups" });
    await boxProxy.waitForDeployment();
    const proxyAddress = await boxProxy.getAddress();
    console.log("Proxy deployed with Box");
    const boxProxyV1 = await ethers.getContractAt("Box", proxyAddress);
    console.log("Version : " + (await boxProxyV1.version()).toString());
    await upgrades.upgradeProxy(proxyAddress, boxV2);
    console.log("Proxy upgraded with BoxV2");
    const boxProxyV2 = await ethers.getContractAt("BoxV2", proxyAddress);
    console.log("Version : " + (await boxProxyV2.version()).toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
