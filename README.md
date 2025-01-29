# Subnetting API

This API provides functions for calculating subnets based on a given IP address and subnet mask. It supports retrieving a single subnet as well as retrieving all possible subnets (up to a maximum of 16).

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```

2. Navigate to the project directory:
    ```sh
    cd subnetting-generator-api
    ```

3. Install the dependencies:
    ```sh
    npm install
    ```

## Starting the API

Start the API with the following command:
```sh
npm start
```
## Functions

### Example
```
http://127.0.0.1/:3000/api/subnet/all/192.168.1.0?mask=%2F24
```
**IP:** 192.168.1.0  
**MASK:** /24  

If no mask is specified automatically `/24`

### GET /api/subnet/{ip}

This endpoint calculates the first subnet based on the given IP address and subnet mask.

- **Path Parameters:**
  - `ip` (string): The IP address (e.g., 192.168.1.1). Must be a valid IPv4 address.

- **Query Parameters:**
  - `mask` (string, optional): The subnet mask in CIDR format (e.g., /24) or IP format (e.g., 255.255.255.0). Default is `/24`. Must be a valid subnet mask.

- **Response:**
  - `200 OK`: Successful response with the calculated subnet.
    - **Example Response:**
      ```json
      {
        "subnet": "192.168.1.0",
        "mask": "255.255.255.0",
        "cidr": "/24",
        "firstIp": "192.168.1.1",
        "lastIp": "192.168.1.254",
        "broadcast": "192.168.1.255"
      }
      ```
  - `400 Bad Request`: Invalid IP Address or Subnet Mask.
    - **Example Response:**
      ```json
      {
        "error": "Invalid IP Address"
      }
      ```
  - `500 Internal Server Error`: Internal server error.
    - **Example Response:**
      ```json
      {
        "error": "Internal Server Error"
      }
      ```

### GET /api/subnet/all/{ip}

This endpoint calculates all possible subnets (up to a maximum of 16) based on the given IP address and subnet mask.

- **Path Parameters:**
  - `ip` (string): The IP address (e.g., 192.168.1.1). Must be a valid IPv4 address.

- **Query Parameters:**
  - `mask` (string, optional): The subnet mask in CIDR format (e.g., /24) or IP format (e.g., 255.255.255.0). Default is `/24`. Must be a valid subnet mask.

- **Response:**
  - `200 OK`: Successful response with a list of calculated subnets.
    - **Example Response:**
      ```json
      [
        {
          "subnet": "192.168.1.0",
          "mask": "255.255.255.0",
          "cidr": "/24",
          "firstIp": "192.168.1.1",
          "lastIp": "192.168.1.254",
          "broadcast": "192.168.1.255"
        },
        {
          "subnet": "192.168.2.0",
          "mask": "255.255.255.0",
          "cidr": "/24",
          "firstIp": "192.168.2.1",
          "lastIp": "192.168.2.254",
          "broadcast": "192.168.2.255"
        }
        // ... up to 16 subnets
      ]
      ```
  - `400 Bad Request`: Invalid IP Address or Subnet Mask.
    - **Example Response:**
      ```json
      {
        "error": "Invalid IP Address"
      }
      ```
  - `500 Internal Server Error`: Internal server error.
    - **Example Response:**
      ```json
      {
        "error": "Internal Server Error"
      }
      ```

## OpenAPI Specification
The OpenAPI specification for this API is located in the `api-spec.yaml` file.

## License

This project is licensed under the MIT-Lizenz.

---
**© 2025 Jojo252511**
