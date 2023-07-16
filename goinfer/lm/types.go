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

type Task struct {
	Name        string                  `yaml:"name"`
	Model       string                  `yaml:"model"`
	Template    string                  `yaml:"template"`
	ModelConf   ModelConf               `yaml:"modelConf,omitempty"`
	InferParams OptionalInferParameters `yaml:"inferParams,omitempty"`
}

type ModelConf struct {
	Ctx int `yaml:"ctx"`
}

type OptionalInferParameters struct {
	Threads     int     `yaml:"threads,omitempty"`
	Tokens      int     `yaml:"tokens,omitempty"`
	TopK        int     `yaml:"topK,omitempty"`
	TopP        float64 `yaml:"topP,omitempty"`
	Temp        float64 `yaml:"temp,omitempty"`
	FreqPenalty int     `yaml:"freqPenalty,omitempty"`
	PresPenalty int     `yaml:"presPenalty,omitempty"`
	Tfs         int     `yaml:"tfs,omitempty"`
	Stop        string  `yaml:"stop,omitempty"`
}
