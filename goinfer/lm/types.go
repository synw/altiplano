package lm

type InferenceParams struct {
	Threads           int
	Tokens            int
	TopK              int
	TopP              float64
	Temperature       float64
	FrequencyPenalty  float64
	PresencePenalty   float64
	TailFreeSamplingZ float64
	StopPrompts       []string
}

type InferenceResult struct {
	Text               string  `json:"text"`
	ThinkingTime       float64 `json:"thinkingTime"`
	ThinkingTimeFormat string  `json:"thinkingTimeFormat"`
	EmitTime           float64 `json:"emitTime"`
	EmitTimeFormat     string  `json:"emitTimeFormat"`
	TotalTime          float64 `json:"totalTime"`
	TotalTimeFormat    string  `json:"totalTimeFormat"`
	TokensPerSecond    float64 `json:"tokensPerSecond"`
	TotalTokens        int     `json:"totalTokens"`
}
