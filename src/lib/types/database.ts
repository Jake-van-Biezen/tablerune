export type CampaignRole = 'dm' | 'player';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					user_id: string;
					display_name: string;
					preferred_role: CampaignRole;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					user_id: string;
					display_name?: string;
					preferred_role?: CampaignRole;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					display_name?: string;
					preferred_role?: CampaignRole;
					updated_at?: string;
				};
				Relationships: [];
			};
		};
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: {
			campaign_role: CampaignRole;
		};
		CompositeTypes: Record<string, never>;
	};
	storage: {
		Tables: Record<string, never>;
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: Record<string, never>;
		CompositeTypes: Record<string, never>;
	};
}
