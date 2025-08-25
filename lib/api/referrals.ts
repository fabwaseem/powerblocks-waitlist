import { api } from "@/lib/axios";

// export class ReferralHistoryDto {
//   @ApiProperty()
//   id: string;

//   @ApiProperty()
//   username: string;

//   @ApiProperty()
//   date: string;

//   @ApiProperty()
//   registered: boolean;

//   @ApiProperty()
//   verified: boolean;

//   @ApiProperty()
//   reward: string;

//   @ApiProperty()
//   status: "COLLECTED" | "CLAIMABLE" | "PENDING";
// }

// export class ReferralStatsDto {
//   @ApiProperty()
//   pendingReferrals: number;

//   @ApiProperty()
//   successfulReferrals: number;
// }

// export class ReferralInfoDto {
//   @ApiProperty()
//   referralCode: string;

//   @ApiProperty()
//   stats: ReferralStatsDto;

//   @ApiProperty({ type: [ReferralHistoryDto] })
//   history: ReferralHistoryDto[];
// }

export interface ReferralStats {
  pendingReferrals: number;
  successfulReferrals: number;
}

export interface ReferralHistory {
  id: string;
  username: string;
  date: string;
  registered: boolean;
  verified: boolean;
  reward: string;
  status: "COLLECTED" | "CLAIMABLE" | "PENDING";
}

export interface UserReferralInfo {
  referralCode: string;
  stats: ReferralStats;
  history: ReferralHistory[];
}

export const referralsApi = {
  getUserReferralInfo: async (): Promise<UserReferralInfo> => {
    const response = await api.get<UserReferralInfo>("/referrals");
    return response.data;
  },
};
