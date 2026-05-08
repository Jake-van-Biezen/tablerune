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
			campaigns: {
				Row: {
					id: string;
					name: string;
					description: string;
					created_by: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					name: string;
					description?: string;
					created_by: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					name?: string;
					description?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			campaign_members: {
				Row: {
					campaign_id: string;
					user_id: string;
					role: CampaignRole;
					invited_by: string | null;
					joined_at: string;
				};
				Insert: {
					campaign_id: string;
					user_id: string;
					role: CampaignRole;
					invited_by?: string | null;
					joined_at?: string;
				};
				Update: {
					role?: CampaignRole;
					invited_by?: string | null;
					joined_at?: string;
				};
				Relationships: [];
			};
			campaign_invitations: {
				Row: {
					id: string;
					campaign_id: string;
					invited_by: string;
					invited_email: string;
					role: CampaignRole;
					token: string;
					expires_at: string;
					accepted_by: string | null;
					accepted_at: string | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					campaign_id: string;
					invited_by: string;
					invited_email: string;
					role?: CampaignRole;
					token?: string;
					expires_at?: string;
					accepted_by?: string | null;
					accepted_at?: string | null;
					created_at?: string;
				};
				Update: {
					invited_email?: string;
					role?: CampaignRole;
					expires_at?: string;
					accepted_by?: string | null;
					accepted_at?: string | null;
				};
				Relationships: [];
			};
			characters: {
				Row: {
					id: string;
					campaign_id: string;
					player_user_id: string;
					name: string;
					race: string;
					class_spec: string;
					current_hp: number;
					max_hp: number;
					background_story: string;
					decision_summary: string;
					metadata: Json;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					campaign_id: string;
					player_user_id: string;
					name: string;
					race?: string;
					class_spec?: string;
					current_hp?: number;
					max_hp?: number;
					background_story?: string;
					decision_summary?: string;
					metadata?: Json;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					name?: string;
					race?: string;
					class_spec?: string;
					current_hp?: number;
					max_hp?: number;
					background_story?: string;
					decision_summary?: string;
					metadata?: Json;
					updated_at?: string;
				};
				Relationships: [];
			};
			inventory_items: {
				Row: {
					id: string;
					campaign_id: string;
					character_id: string;
					name: string;
					quantity: number;
					notes: string;
					metadata: Json;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					campaign_id: string;
					character_id: string;
					name: string;
					quantity?: number;
					notes?: string;
					metadata?: Json;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					name?: string;
					quantity?: number;
					notes?: string;
					metadata?: Json;
					updated_at?: string;
				};
				Relationships: [];
			};
			decision_logs: {
				Row: {
					id: string;
					campaign_id: string;
					character_id: string | null;
					created_by: string;
					decision_text: string;
					metadata: Json;
					created_at: string;
				};
				Insert: {
					id?: string;
					campaign_id: string;
					character_id?: string | null;
					created_by: string;
					decision_text: string;
					metadata?: Json;
					created_at?: string;
				};
				Update: {
					decision_text?: string;
					metadata?: Json;
				};
				Relationships: [];
			};
			maps: {
				Row: {
					id: string;
					campaign_id: string;
					title: string;
					storage_path: string;
					uploaded_by: string;
					metadata: Json;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					campaign_id: string;
					title: string;
					storage_path: string;
					uploaded_by: string;
					metadata?: Json;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					title?: string;
					storage_path?: string;
					metadata?: Json;
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
