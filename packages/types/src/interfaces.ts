interface BaseLMContract {
  name: string;
  path: string;
}

interface LMContract {
  id: number;
  name: string;
  path: string;
  description?: string;
  type?: string;
  family?: string;
  disabled?: boolean;
}

interface TemplateVar {
  name: string;
  content: string;
}

interface InferResultContract {
  tokens: Array<string>;
  completed: boolean;
  text: string;
  thinkingTime: number;
  inferenceTime: number;
  totalTime: number;
  tokensPerSeconds: number;
}

interface LogitBias {
  token: number
  bias: number
}

interface OptionalInferenceParams {
  /**
   * Number of cpu threads to use
   */
  nThreads?: number
  /**
   * Max number of token to output
   */
  nTokPredict?: number
  /**
   * logit bias for specific tokens
   * Default: None
   */
  logitBias?: Array<LogitBias>
  /**
   * top k tokens to sample from
   * Range: <= 0 to use vocab size
   * Default: 40
   */
  topK?: number
  /**
   * top p tokens to sample from
   * Default: 0.95
   * 1.0 = disabled
   */
  topP?: number
  /**
   * tail free sampling
   * Default: 1.0
   * 1.0 = disabled
   */
  tfsZ?: number
  /**
   * temperature
   * Default: 0.80
   * 1.0 = disabled
   */
  temp?: number
  /**
   * locally typical sampling
   * Default: 1.0
   * 1.0 = disabled
   */
  typicalP?: number
  /**
   * repeat penalty
   * Default: 1.10
   * 1.0 = disabled
   */
  repeatPenalty?: number
  /**
   * last n tokens to penalize
   * Default: 64
   * 0 = disable penalty, -1 = context size
   */
  repeatLastN?: number
  /**
   * frequency penalty
   * Default: 0.00
   * 1.0 = disabled
   */
  frequencyPenalty?: number
  /**
   * presence penalty
   * Default: 0.00
   * 1.0 = disabled
   */
  presencePenalty?: number
  /**
   * Mirostat 1.0 algorithm described in the paper https://arxiv.org/abs/2007.14966. Uses tokens instead of words.
   * Mirostat: A Neural Text Decoding Algorithm that Directly Controls Perplexity
   * Default: 0
   * 0 = disabled
   * 1 = mirostat 1.0
   * 2 = mirostat 2.0
   */
  mirostat?: number
  /**
   * The target cross-entropy (or surprise) value you want to achieve for the generated text. A higher value corresponds to more surprising or less predictable text, while a lower value corresponds to less surprising or more predictable text.
   * Default: 5.0
   */
  mirostatTau?: number
  /**
   * The learning rate used to update `mu` based on the error between the target and observed surprisal of the sampled word. A larger learning rate will cause `mu` to be updated more quickly, while a smaller learning rate will result in slower updates.
   * Default: 0.1
   */
  mirostatEta?: number
  /**
   * stop sequence
   * Default: None
   */
  stopSequence?: string
  /**
   * consider newlines as a repeatable token
   * Default: true
   */
  penalizeNl?: boolean
}

interface OptionalModelParams {
  nCtx?: number;
  nGpuLayers?: number;
  seed?: number;
  f16Kv?: boolean;
  logitsAll?: boolean;
  vocabOnly?: boolean;
  useMlock?: boolean;
  embedding?: boolean;
  useMmap?: boolean;
  enableLogging?: boolean;
}

export {
  BaseLMContract,
  LMContract,
  OptionalInferenceParams,
  OptionalModelParams,
  LogitBias,
  TemplateVar,
  InferResultContract,
}