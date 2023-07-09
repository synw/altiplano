package lm

type InferenceParams struct {
	Threads           int      `json:"threads"`
	Tokens            int      `json:"tokens"`
	TopK              int      `json:"topK"`
	TopP              float64  `json:"topP"`
	Temperature       float64  `json:"temp"`
	FrequencyPenalty  float64  `json:"freqPenalty"`
	PresencePenalty   float64  `json:"presPrenalty"`
	TailFreeSamplingZ float64  `json:"tfs"`
	StopPrompts       []string `json:"stop"`
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
