export type Staking = {
  "version": "0.1.0",
  "name": "staking",
  "instructions": [
    {
      "name": "initialize",
      "docs": [
        "* Initialize global pool\n     * super admin sets to the caller of this instruction"
      ],
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "changeAdmin",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalPool",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newAdmin",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "initUser",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "lockPnft",
      "docs": [
        "* User can lock pNFTs from specific collection"
      ],
      "accounts": [
        {
          "name": "globalPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMintEdition",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong edition is supplied"
          ]
        },
        {
          "name": "tokenMintRecord",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong record is supplied"
          ]
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong metadata is supplied"
          ]
        },
        {
          "name": "authRules",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong rules are supplied"
          ]
        },
        {
          "name": "sysvarInstructions",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong sysvar ixns are supplied"
          ]
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK intstruction will fail if wrong program is supplied"
          ]
        },
        {
          "name": "authRulesProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK intstruction will fail if wrong program is supplied"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lockPeriod",
          "type": "i64"
        }
      ]
    },
    {
      "name": "claimReward",
      "docs": [
        "* User can claim reward"
      ],
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userRewardAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unlockPnft",
      "docs": [
        "* User can unlock pNFTs when they want"
      ],
      "accounts": [
        {
          "name": "globalPool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMintEdition",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong edition is supplied"
          ]
        },
        {
          "name": "tokenMintRecord",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong record is supplied"
          ]
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong metadata is supplied"
          ]
        },
        {
          "name": "authRules",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong rules are supplied"
          ]
        },
        {
          "name": "sysvarInstructions",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong sysvar ixns are supplied"
          ]
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK intstruction will fail if wrong program is supplied"
          ]
        },
        {
          "name": "authRulesProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK intstruction will fail if wrong program is supplied"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "globalPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "userPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "itemCount",
            "type": "u64"
          },
          {
            "name": "items",
            "type": {
              "array": [
                {
                  "defined": "StakedNFT"
                },
                64
              ]
            }
          },
          {
            "name": "rewardTime",
            "type": "i64"
          },
          {
            "name": "pendingReward",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "StakedNFT",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftAddr",
            "type": "publicKey"
          },
          {
            "name": "stakeTime",
            "type": "i64"
          },
          {
            "name": "rewardTime",
            "type": "i64"
          },
          {
            "name": "lockTime",
            "type": "i64"
          },
          {
            "name": "rate",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAdmin",
      "msg": "Admin address dismatch"
    },
    {
      "code": 6001,
      "name": "ExceedMaxCount",
      "msg": "Max count reached"
    },
    {
      "code": 6002,
      "name": "InvalidMetadata",
      "msg": "Metadata address is invalid"
    },
    {
      "code": 6003,
      "name": "InvalidCollection",
      "msg": "Collection is invalid"
    },
    {
      "code": 6004,
      "name": "MetadataCreatorParseError",
      "msg": "Can not parse creators in metadata"
    },
    {
      "code": 6005,
      "name": "NftNotExist",
      "msg": "Can not find NFT"
    },
    {
      "code": 6006,
      "name": "StillLocked",
      "msg": "Can not unlock NFT before time"
    },
    {
      "code": 6007,
      "name": "LackLamports",
      "msg": "Insufficient Lamports"
    },
    {
      "code": 6008,
      "name": "InvalidOwner",
      "msg": "NFT Owner key mismatch"
    },
    {
      "code": 6009,
      "name": "BeforeLockTime",
      "msg": "You can't Unstake Before LockTime"
    },
    {
      "code": 6010,
      "name": "InvalidNFTAddress",
      "msg": "No Matching NFT to withdraw"
    }
  ]
};

export const IDL: Staking = {
  "version": "0.1.0",
  "name": "staking",
  "instructions": [
    {
      "name": "initialize",
      "docs": [
        "* Initialize global pool\n     * super admin sets to the caller of this instruction"
      ],
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "changeAdmin",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalPool",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newAdmin",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "initUser",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "lockPnft",
      "docs": [
        "* User can lock pNFTs from specific collection"
      ],
      "accounts": [
        {
          "name": "globalPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMintEdition",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong edition is supplied"
          ]
        },
        {
          "name": "tokenMintRecord",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong record is supplied"
          ]
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong metadata is supplied"
          ]
        },
        {
          "name": "authRules",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong rules are supplied"
          ]
        },
        {
          "name": "sysvarInstructions",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong sysvar ixns are supplied"
          ]
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK intstruction will fail if wrong program is supplied"
          ]
        },
        {
          "name": "authRulesProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK intstruction will fail if wrong program is supplied"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lockPeriod",
          "type": "i64"
        }
      ]
    },
    {
      "name": "claimReward",
      "docs": [
        "* User can claim reward"
      ],
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userRewardAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unlockPnft",
      "docs": [
        "* User can unlock pNFTs when they want"
      ],
      "accounts": [
        {
          "name": "globalPool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMintEdition",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong edition is supplied"
          ]
        },
        {
          "name": "tokenMintRecord",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong record is supplied"
          ]
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong metadata is supplied"
          ]
        },
        {
          "name": "authRules",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong rules are supplied"
          ]
        },
        {
          "name": "sysvarInstructions",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong sysvar ixns are supplied"
          ]
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK intstruction will fail if wrong program is supplied"
          ]
        },
        {
          "name": "authRulesProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK intstruction will fail if wrong program is supplied"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "globalPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "userPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "itemCount",
            "type": "u64"
          },
          {
            "name": "items",
            "type": {
              "array": [
                {
                  "defined": "StakedNFT"
                },
                64
              ]
            }
          },
          {
            "name": "rewardTime",
            "type": "i64"
          },
          {
            "name": "pendingReward",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "StakedNFT",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftAddr",
            "type": "publicKey"
          },
          {
            "name": "stakeTime",
            "type": "i64"
          },
          {
            "name": "rewardTime",
            "type": "i64"
          },
          {
            "name": "lockTime",
            "type": "i64"
          },
          {
            "name": "rate",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAdmin",
      "msg": "Admin address dismatch"
    },
    {
      "code": 6001,
      "name": "ExceedMaxCount",
      "msg": "Max count reached"
    },
    {
      "code": 6002,
      "name": "InvalidMetadata",
      "msg": "Metadata address is invalid"
    },
    {
      "code": 6003,
      "name": "InvalidCollection",
      "msg": "Collection is invalid"
    },
    {
      "code": 6004,
      "name": "MetadataCreatorParseError",
      "msg": "Can not parse creators in metadata"
    },
    {
      "code": 6005,
      "name": "NftNotExist",
      "msg": "Can not find NFT"
    },
    {
      "code": 6006,
      "name": "StillLocked",
      "msg": "Can not unlock NFT before time"
    },
    {
      "code": 6007,
      "name": "LackLamports",
      "msg": "Insufficient Lamports"
    },
    {
      "code": 6008,
      "name": "InvalidOwner",
      "msg": "NFT Owner key mismatch"
    },
    {
      "code": 6009,
      "name": "BeforeLockTime",
      "msg": "You can't Unstake Before LockTime"
    },
    {
      "code": 6010,
      "name": "InvalidNFTAddress",
      "msg": "No Matching NFT to withdraw"
    }
  ]
};
