//   // Map ESPN Response status type to MatchupStatus enum
//   mapEspnStatusToMatchupStatus(espnStatusType?: EspnStatusType): MatchupStatus {
//     switch (espnStatusType?.name) {
//       case EspnStatusName.SCHEDULED:
//         return MatchupStatus.SCHEDULED;
//       case EspnStatusName.IN_PROGRESS:
//       case EspnStatusName.CURRENT:
//         return MatchupStatus.IN_PROGRESS;
//       case EspnStatusName.FINAL:
//         return MatchupStatus.FINISHED;
//       case EspnStatusName.CANCELED:
//         return MatchupStatus.CANCELLED;
//       default:
//         return MatchupStatus.SCHEDULED;
//     }
//   }

//   // Map ESPN Response status type to LineStatus enum
//   mapEspnStatusToLineStatus(espnStatusType?: EspnStatusType): LineStatus {
//     switch (espnStatusType?.name) {
//       case EspnStatusName.SCHEDULED:
//         return LineStatus.OPEN;
//       case EspnStatusName.IN_PROGRESS:
//       case EspnStatusName.CURRENT:
//         return LineStatus.LOCKED;
//       case EspnStatusName.FINAL:
//         return LineStatus.RESOLVED;
//       case EspnStatusName.CANCELED:
//         return LineStatus.CANCELLED;
//       default:
//         return LineStatus.OPEN;
//     }
//   }

//   const newMatchupStatus = this.mapEspnStatusToMatchupStatus(
//     espnStatus.type,
//   );
//   const newLineStatus = this.mapEspnStatusToLineStatus(espnStatus.type);
