export const environment: {
    reownProjectId: string,
    blockchainNetworks: {
        solana: {
            selected: 'devnet' | 'mainnet',
            endpoints: {
                mainnet: string,
                devnet: string,
            }
        }, 
    },
} = {
    reownProjectId: 'f9475d25490661ea7876f3be596b200d', // Get Reown projectId from https://cloud.reown.com
    blockchainNetworks: {
        solana: {
            selected: "devnet",
            endpoints: {
                mainnet: 'https://api.mainnet-beta.solana.com',
                devnet: 'https://api.devnet.solana.com', // https://rpc.ankr.com/solana_devnet
            }
        }, 
    },
};