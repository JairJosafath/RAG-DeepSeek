export interface ModelDetails {
  parent_model: string;
  format: string;
  family: string;
  families: string[];
  parameter_size: string;
  quantization_level: string;
}

export interface Model {
  model: string;
  modified_at: string;
  digest: string;
  size: number;
  details: ModelDetails;
}

export interface ModelsResponse {
  models: Model[];
} 