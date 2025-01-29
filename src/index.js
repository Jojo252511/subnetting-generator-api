const express = require('express');
const app = express();
const port = 3000;

/**
 * calculate subnet
 * @param {String} ip 
 * @param {String} subnetMask 
 * @returns 
 */
function calculateSubnet(ip, subnetMask) 
{
    const ipParts = ip.split('.').map(Number);
    const maskParts = subnetMask.includes('/') ? 
        Array(4).fill(0).map((_, i) => {
            const bits = Math.min(8, Math.max(0, parseInt(subnetMask.split('/')[1]) - i * 8));
            return 256 - Math.pow(2, 8 - bits);
        }) : 
        subnetMask.split('.').map(Number);

    const networkParts = ipParts.map((part, index) => part & maskParts[index]);
    const subnet = networkParts.join('.');

    const invertedMaskParts = maskParts.map(part => 255 - part);
    const broadcastParts = networkParts.map((part, index) => part | invertedMaskParts[index]);
    const broadcast = broadcastParts.join('.');

    const firstIpParts = [...networkParts];
    firstIpParts[3] += 1;
    const firstIp = firstIpParts.join('.');

    const lastIpParts = [...broadcastParts];
    lastIpParts[3] -= 1;
    const lastIp = lastIpParts.join('.');

    return {
        subnet: subnet,
        mask: maskParts.join('.'),
        cidr: subnetMask.includes('/') ? subnetMask : '/' + maskParts.reduce((acc, part) => acc + part.toString(2).split('1').length - 1, 0),
        firstIp: firstIp,
        lastIp: lastIp,
        broadcast: broadcast
    };
}

/**
 * Calculate more subnets
 * @param {String} subnet
 * @param {String} cidr
 * @returns {Object} result
 */
function moreSubnets(subnet, cidr) 
{
    const subnetParts = subnet.split('.').map(Number);
    const subnetSize = Math.pow(2, 32 - parseInt(cidr.split('/')[1]));

    let subnetInt = (subnetParts[0] << 24) | (subnetParts[1] << 16) | (subnetParts[2] << 8) | subnetParts[3];
    subnetInt += subnetSize;

    const nextSubnetParts = 
    [
        (subnetInt >> 24) & 255,
        (subnetInt >> 16) & 255,
        (subnetInt >> 8) & 255,
        subnetInt & 255
    ];

    const nextSubnet = nextSubnetParts.join('.');
    return calculateSubnet(nextSubnet, cidr);
}

/**
 * 
 * @param {String} ip 
 * @returns boolean
 */
function isValidIp(ip) 
{
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
}

/**
 * 
 * @param {String} mask 
 * @returns boolean
 */
function isValidSubnetMask(mask) 
{
    const regex = /^(\/([0-9]|[1-2][0-9]|3[0-2])|((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/;
    return regex.test(mask);
}

/**
 * Get endpoint for subnet
 * @param {String} ip
 * @param {String} mask
 * @returns {Object} result
 * @throws {Error} Internal Server Error
 * @throws {Error} Invalid IP Address
 * @throws {Error} Invalid Subnet Mask
 * @throws {Error} Invalid CIDR
 */
app.get('/api/subnet/:ip', (req, res) => 
    {
    try 
    {
        const ip = req.params.ip;
        const mask = req.query.mask || '/24';

        if (!isValidIp(ip)) 
        {
            return res.status(400).json({ error: 'Invalid IP Address' });
        }

        if (!isValidSubnetMask(mask)) 
        {
            return res.status(400).json({ error: 'Invalid Subnet Mask' });
        }

        const result = calculateSubnet(ip, mask);
        res.json(result);
    } 
    
    catch (error) 
    {
        res.status(500).json({ error: 'Internal Server Error' });
    }
    }
);

/**
 * Get endpoint for all subnets
 * @param {String} ip
 * @param {String} mask
 * @returns {Array} results
 * @throws {Error} Internal Server Error
 * @throws {Error} Invalid IP Address
 * @throws {Error} Invalid Subnet Mask
 * @throws {Error} Invalid CIDR
 */
app.get('/api/subnet/all/:ip', (req, res) => 
{
    try 
    {
        const ip = req.params.ip;
        const mask = req.query.mask || '/24';

        if (!isValidIp(ip)) 
        {
            return res.status(400).json({ error: 'Invalid IP Address' });
        }

        if (!isValidSubnetMask(mask)) 
        {
            return res.status(400).json({ error: 'Invalid Subnet Mask' });
        }

        let result = calculateSubnet(ip, mask);
        const results = [];
        let count = 0;
        while (result.subnet !== "0.0.0.0" && count < 16) 
        {
            results.push(result);
            result = moreSubnets(result.subnet, result.cidr);
            count++;
        }
        res.json(results);
    } 
    
    catch (error) 
    {
        res.status(500).json({ error: 'Internal Server Error' });
    }
    }
);

/**
 * Listen on port
 * @param {Number} port
 */
app.listen(port, () => {
    console.log(`Subnetting API listening at http://localhost:${port}`);
});