import os from "os";
// function getIPAddresses() {
//   const interfaces = os.networkInterfaces();
//   const addresses = [];

//   for (const interfaceName in interfaces) {
//     const interfaceInfo = interfaces[interfaceName];

//     for (const i of interfaceInfo) {
//       // Check if the interface has an IPv4 or IPv6 address and is not an internal (localhost) interface
//       if (i.family === "IPv4" || i.family === "IPv6") {
//         if (!i.internal) {
//           addresses.push({
//             interface: interfaceName,
//             address: i.address,
//           });
//         }
//       }
//     }
//   }

//   return addresses;
// }

// const ipAddresses = getIPAddresses();
// console.log("Available IP addresses:", ipAddresses);
// sharedIpAddress = `http://${ipAddresses[5].address}:${port}`;

function getPrivateIPv4Address(ipAddresses) {
  // Define private IPv4 ranges
  const privateRanges = [
    /^192\.168\./, // 192.168.0.0 – 192.168.255.255
    //         /^10\./, // 10.0.0.0 – 10.255.255.255
    //         /^172\.(1[6-9]|2\d|3[01])\./ // 172.16.0.0 – 172.31.255.255
  ];

  // Find the first matching private IPv4 address
  for (const ipObj of ipAddresses) {
    if (privateRanges.some((range) => range.test(ipObj.address))) {
      return ipObj.address;
    }
  }

  return null; // No private IPv4 address found
}

// Example usage

// const privateIP = getPrivateIPv4Address(ipAddresses);
// console.log("Private IPv4 Address:", privateIP);

export const sharedIpAddress = (port) => {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName];

    for (const i of interfaceInfo) {
      addresses.push({
        interface: interfaceName,
        address: i.address,
      });
    }
  }

  const privateIP = getPrivateIPv4Address(addresses) || "localhost";
  return `http://${privateIP}:${port}`;
};
