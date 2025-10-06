/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/ralli_bet.json`.
 */
export type RalliBet = {
  "address": "CtQi2SG7Mc8zapDRvWA5zoQoAWSwKRvqJsLCmCpiRPgN",
  "metadata": {
    "name": "ralliBet",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "calculateCorrect",
      "discriminator": [
        70,
        99,
        189,
        145,
        120,
        54,
        25,
        190
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.game_id",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "bet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "game"
              },
              {
                "kind": "account",
                "path": "bet.player",
                "account": "bet"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "calculateWinners",
      "discriminator": [
        140,
        11,
        52,
        209,
        154,
        217,
        87,
        194
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.game_id",
                "account": "game"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "cancelGame",
      "discriminator": [
        121,
        194,
        154,
        118,
        103,
        235,
        149,
        52
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.game_id",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "gameEscrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "game"
              }
            ]
          }
        },
        {
          "name": "gameResult",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  114,
                  101,
                  115,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "game"
              }
            ]
          }
        },
        {
          "name": "adminOrUser",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createGame",
      "discriminator": [
        124,
        69,
        75,
        66,
        184,
        220,
        72,
        206
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "gameId"
              }
            ]
          }
        },
        {
          "name": "gameEscrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "game"
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "gameVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "game"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "u64"
        },
        {
          "name": "maxUsers",
          "type": "u8"
        },
        {
          "name": "entryFee",
          "type": "u64"
        },
        {
          "name": "numberOfLines",
          "type": "u8"
        },
        {
          "name": "admin",
          "type": {
            "option": "pubkey"
          }
        }
      ]
    },
    {
      "name": "createLine",
      "discriminator": [
        252,
        151,
        106,
        66,
        40,
        17,
        105,
        73
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "line",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  110,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "lineSeed"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "lineSeed",
          "type": "u64"
        },
        {
          "name": "statId",
          "type": "u16"
        },
        {
          "name": "predictedValue",
          "type": "f64"
        },
        {
          "name": "athleteId",
          "type": "u64"
        },
        {
          "name": "startsAt",
          "type": "i64"
        }
      ]
    },
    {
      "name": "joinGame",
      "discriminator": [
        107,
        112,
        18,
        38,
        56,
        173,
        60,
        128
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.game_id",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "gameEscrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "game"
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "userTokens",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "gameVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "game"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": []
    },
    {
      "name": "resolveGame",
      "discriminator": [
        25,
        119,
        183,
        229,
        196,
        69,
        169,
        79
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.game_id",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "gameEscrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "game"
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "gameVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "game"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "treasuryVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "treasury"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "feePercentage",
          "type": "u16"
        }
      ]
    },
    {
      "name": "resolveLine",
      "discriminator": [
        249,
        172,
        97,
        191,
        184,
        158,
        240,
        145
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "line",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  110,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "line.seed",
                "account": "line"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "result",
          "type": {
            "defined": {
              "name": "direction"
            }
          }
        },
        {
          "name": "actualValue",
          "type": "f64"
        },
        {
          "name": "shouldRefundBettors",
          "type": "bool"
        }
      ]
    },
    {
      "name": "submitBet",
      "discriminator": [
        1,
        3,
        52,
        11,
        77,
        136,
        116,
        139
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.game_id",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "bet",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  101,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "game"
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "picks",
          "type": {
            "vec": {
              "defined": {
                "name": "pick"
              }
            }
          }
        }
      ]
    },
    {
      "name": "updateLine",
      "discriminator": [
        232,
        80,
        58,
        171,
        8,
        177,
        146,
        160
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "line",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  110,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "lineSeed"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "lineSeed",
          "type": "u64"
        },
        {
          "name": "newPredictedValue",
          "type": "f64"
        },
        {
          "name": "shouldRefundBettors",
          "type": "bool"
        }
      ]
    },
    {
      "name": "withdrawSubmission",
      "discriminator": [
        242,
        62,
        195,
        3,
        192,
        241,
        52,
        174
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.game_id",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "gameEscrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119
                ]
              },
              {
                "kind": "account",
                "path": "game"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "newEarliestLine",
          "docs": [
            "Optional: Line account with the new earliest start time (if provided)"
          ],
          "optional": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "newFirstLineStartsAt",
          "type": {
            "option": "i64"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "bet",
      "discriminator": [
        147,
        23,
        35,
        59,
        15,
        75,
        155,
        32
      ]
    },
    {
      "name": "game",
      "discriminator": [
        27,
        90,
        166,
        125,
        74,
        100,
        121,
        18
      ]
    },
    {
      "name": "gameEscrow",
      "discriminator": [
        37,
        195,
        2,
        234,
        81,
        128,
        248,
        133
      ]
    },
    {
      "name": "gameResult",
      "discriminator": [
        154,
        160,
        133,
        130,
        0,
        179,
        92,
        10
      ]
    },
    {
      "name": "line",
      "discriminator": [
        15,
        73,
        125,
        153,
        180,
        13,
        80,
        187
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "gameFull",
      "msg": "Game is full"
    },
    {
      "code": 6001,
      "name": "gameNotOpen",
      "msg": "Game is not open for joining"
    },
    {
      "code": 6002,
      "name": "gameNotLocked",
      "msg": "Game is not locked"
    },
    {
      "code": 6003,
      "name": "gameAlreadyResolved",
      "msg": "Game is already resolved"
    },
    {
      "code": 6004,
      "name": "userAlreadyJoined",
      "msg": "User already joined"
    },
    {
      "code": 6005,
      "name": "userNotInGame",
      "msg": "User not in game"
    },
    {
      "code": 6006,
      "name": "invalidPickCount",
      "msg": "Invalid pick count (must be between 2 and 6)"
    },
    {
      "code": 6007,
      "name": "duplicateStatInPicks",
      "msg": "Duplicate stat in picks"
    },
    {
      "code": 6008,
      "name": "betAlreadySubmitted",
      "msg": "Bet already submitted"
    },
    {
      "code": 6009,
      "name": "invalidLineStartTime",
      "msg": "Invalid line start time - must be in the future"
    },
    {
      "code": 6010,
      "name": "lineStartTimeMismatch",
      "msg": "Line start time does not match provided line account"
    },
    {
      "code": 6011,
      "name": "lineNotInGame",
      "msg": "Line is not part of this game"
    },
    {
      "code": 6012,
      "name": "unauthorizedLineCreation",
      "msg": "Unauthorized to create lines - admin only"
    },
    {
      "code": 6013,
      "name": "gameNotOpenforLine",
      "msg": "Game is not open for line creation"
    },
    {
      "code": 6014,
      "name": "maxLinesReached",
      "msg": "Maximum lines per game reached"
    },
    {
      "code": 6015,
      "name": "unauthorizedLineResolution",
      "msg": "Unauthorized to resolve line"
    },
    {
      "code": 6016,
      "name": "lineAlreadyResolved",
      "msg": "Line has already been resolved"
    },
    {
      "code": 6017,
      "name": "lineShouldBeRefunded",
      "msg": "Line should be refunded"
    },
    {
      "code": 6018,
      "name": "lineNotStarted",
      "msg": "Line has not started yet"
    },
    {
      "code": 6019,
      "name": "invalidPredictedValue",
      "msg": "Invalid predicted value - must be greater than 0"
    },
    {
      "code": 6020,
      "name": "directionMismatch",
      "msg": "Direction has a mismatch!"
    },
    {
      "code": 6021,
      "name": "invalidStatId",
      "msg": "Invalid stat ID - must be greater than 0"
    },
    {
      "code": 6022,
      "name": "notEnoughUsers",
      "msg": "Not enough users to lock game"
    },
    {
      "code": 6023,
      "name": "onlyCreator",
      "msg": "Only game creator can perform this action"
    },
    {
      "code": 6024,
      "name": "gameMustBeOpen",
      "msg": "Game must be open to cancel"
    },
    {
      "code": 6025,
      "name": "cannotJoinOwnGame",
      "msg": "Cannot join own game"
    },
    {
      "code": 6026,
      "name": "insufficientFunds",
      "msg": "Insufficient funds"
    },
    {
      "code": 6027,
      "name": "gameAlreadyLocked",
      "msg": "Game already locked"
    },
    {
      "code": 6028,
      "name": "invalidStatResult",
      "msg": "Invalid stat result"
    },
    {
      "code": 6029,
      "name": "allUsersMustSubmitBets",
      "msg": "All users must submit bets before locking"
    },
    {
      "code": 6030,
      "name": "invalidEntryFee",
      "msg": "Invalid entry fee"
    },
    {
      "code": 6031,
      "name": "accountNotWritable",
      "msg": "Invalid account count for operation"
    },
    {
      "code": 6032,
      "name": "accountMismatch",
      "msg": "Account mismatch"
    },
    {
      "code": 6033,
      "name": "unauthorizedRefund",
      "msg": "Unauthorized refund action"
    },
    {
      "code": 6034,
      "name": "gameNotRefundable",
      "msg": "Game is not refundable"
    },
    {
      "code": 6035,
      "name": "gameAlreadyCancelled",
      "msg": "Game already cancelled"
    },
    {
      "code": 6036,
      "name": "gameIsFull",
      "msg": "Game is full"
    },
    {
      "code": 6037,
      "name": "gameCannotBeCancelled",
      "msg": "Game cannot be cancelled"
    },
    {
      "code": 6038,
      "name": "noUsersToRefund",
      "msg": "No users to refund"
    },
    {
      "code": 6039,
      "name": "invalidAccountCount",
      "msg": "Invalid account count for operation"
    },
    {
      "code": 6040,
      "name": "insufficientEscrowBalance",
      "msg": "Insufficient balance in escrow to refund users"
    },
    {
      "code": 6041,
      "name": "escrowAmountMismatch",
      "msg": "Escrow amount mismatch"
    },
    {
      "code": 6042,
      "name": "invalidAccountOwner",
      "msg": "Invalid account owner"
    },
    {
      "code": 6043,
      "name": "escrowGameMismatch",
      "msg": "Escrow game mismatch"
    },
    {
      "code": 6044,
      "name": "refundWindowExpired",
      "msg": "Refund window has expired"
    },
    {
      "code": 6045,
      "name": "invalidGameCreationTime",
      "msg": "Invalid game creation time"
    },
    {
      "code": 6046,
      "name": "arithmeticOverflow",
      "msg": "Arithmetic overflow occurred"
    },
    {
      "code": 6047,
      "name": "invalidMaxUsers",
      "msg": "Invalid max users"
    },
    {
      "code": 6048,
      "name": "gameResultMismatch",
      "msg": "Game result mismatch"
    },
    {
      "code": 6049,
      "name": "duplicateUserAccount",
      "msg": "Duplicate user account"
    },
    {
      "code": 6050,
      "name": "unauthorizedCancellation",
      "msg": "Unauthorized cancellation"
    },
    {
      "code": 6051,
      "name": "betsAlreadyStarted",
      "msg": "Bets have already started"
    },
    {
      "code": 6052,
      "name": "noValidReasonToCancel",
      "msg": "No valid reason to cancel the game"
    },
    {
      "code": 6053,
      "name": "treasuryNotEmpty",
      "msg": "Treasury is not empty"
    },
    {
      "code": 6054,
      "name": "emptyPicks",
      "msg": "Empty picks provided"
    },
    {
      "code": 6055,
      "name": "picksLinesMismatch",
      "msg": "Picks do not match the expected line"
    },
    {
      "code": 6056,
      "name": "invalidLineAccount",
      "msg": "Invalid line account provided"
    },
    {
      "code": 6057,
      "name": "lineAlreadyStarted",
      "msg": "Line already started"
    },
    {
      "code": 6058,
      "name": "invalidRemainingAccountsCount",
      "msg": "Invalid remaining accounts count"
    },
    {
      "code": 6059,
      "name": "invalidNumberOfLines",
      "msg": "Invalid number of lines"
    },
    {
      "code": 6060,
      "name": "tooFewLines",
      "msg": "Too few lines"
    },
    {
      "code": 6061,
      "name": "tooManyLines",
      "msg": "Too many lines"
    },
    {
      "code": 6062,
      "name": "lineMismatch",
      "msg": "Line mismatch"
    },
    {
      "code": 6063,
      "name": "unauthorizedGameResolution",
      "msg": "Only admin can resolve games"
    },
    {
      "code": 6064,
      "name": "noLinesInGame",
      "msg": "Game does not have any lines"
    },
    {
      "code": 6065,
      "name": "missingLineAccounts",
      "msg": "Line accounts are missing"
    },
    {
      "code": 6066,
      "name": "lineNotResolved",
      "msg": "Line is yet to be resolved"
    },
    {
      "code": 6067,
      "name": "excessiveFee",
      "msg": "Unrealistic fees"
    },
    {
      "code": 6068,
      "name": "invalidBetAccount",
      "msg": "Bet account should be valid"
    },
    {
      "code": 6069,
      "name": "betNotInGame",
      "msg": "This bet is not involved in thisgame"
    },
    {
      "code": 6070,
      "name": "invalidBetPlayer",
      "msg": "This bet does not belong to this user"
    },
    {
      "code": 6071,
      "name": "noPlayersInGame",
      "msg": "No users in the game"
    },
    {
      "code": 6072,
      "name": "userAccountNotFound",
      "msg": "User account is not available"
    },
    {
      "code": 6073,
      "name": "numberOfWinnersMismatch",
      "msg": "Number of winners does not match length of winners array"
    },
    {
      "code": 6074,
      "name": "escrowNotEmpty",
      "msg": "Escrow not empty"
    },
    {
      "code": 6075,
      "name": "numberOfWinnersExpectedMismatch",
      "msg": "Number of winners expected does not match number of winners"
    },
    {
      "code": 6076,
      "name": "unauthorizedLineUpdate",
      "msg": "Only admin can update the lines"
    },
    {
      "code": 6077,
      "name": "samePredictedValue",
      "msg": "Predicted value should be different for update"
    },
    {
      "code": 6078,
      "name": "unauthorizedCalculation",
      "msg": "Only admin can calculate correct bets"
    },
    {
      "code": 6079,
      "name": "unauthorizedGameFinalization",
      "msg": "Only admin can finalize the game stats"
    },
    {
      "code": 6080,
      "name": "calculationAlreadyComplete",
      "msg": "Calcualtion is already done"
    },
    {
      "code": 6081,
      "name": "noBetsInGame",
      "msg": "Must have atleast one bet"
    },
    {
      "code": 6082,
      "name": "calculationNotComplete",
      "msg": "Calculation must be completed"
    },
    {
      "code": 6083,
      "name": "incorrectWinnerAccountCount",
      "msg": "Ensure that we have the correct number of winner accounts"
    }
  ],
  "types": [
    {
      "name": "bet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "player",
            "type": "pubkey"
          },
          {
            "name": "picks",
            "type": {
              "vec": {
                "defined": {
                  "name": "pick"
                }
              }
            }
          },
          {
            "name": "correctCount",
            "type": "u8"
          },
          {
            "name": "numCorrect",
            "type": "u8"
          },
          {
            "name": "submittedAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "direction",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "over"
          },
          {
            "name": "under"
          }
        ]
      }
    },
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "firstLineStartsAt",
            "type": "i64"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "users",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "maxUsers",
            "type": "u8"
          },
          {
            "name": "entryFee",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "gameStatus"
              }
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "lockedAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "numberOfLines",
            "type": "u8"
          },
          {
            "name": "involvedLines",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "numWinners",
            "type": "u32"
          },
          {
            "name": "correctVotesToBeWinner",
            "type": "u8"
          },
          {
            "name": "calculationComplete",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "gameEscrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "totalAmount",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "gameResult",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "resolved",
            "type": "bool"
          },
          {
            "name": "winners",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "highestCorrect",
            "type": "u8"
          },
          {
            "name": "totalPool",
            "type": "u64"
          },
          {
            "name": "resolvedAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "gameStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "open"
          },
          {
            "name": "locked"
          },
          {
            "name": "resolved"
          },
          {
            "name": "cancelled"
          }
        ]
      }
    },
    {
      "name": "line",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "statId",
            "type": "u16"
          },
          {
            "name": "predictedValue",
            "type": "f64"
          },
          {
            "name": "actualValue",
            "type": {
              "option": "f64"
            }
          },
          {
            "name": "athleteId",
            "type": "u64"
          },
          {
            "name": "startsAt",
            "type": "i64"
          },
          {
            "name": "seed",
            "type": "u64"
          },
          {
            "name": "result",
            "type": {
              "option": {
                "defined": {
                  "name": "direction"
                }
              }
            }
          },
          {
            "name": "shouldRefundBettors",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "pick",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lineId",
            "type": "pubkey"
          },
          {
            "name": "direction",
            "type": {
              "defined": {
                "name": "direction"
              }
            }
          }
        ]
      }
    }
  ]
};
