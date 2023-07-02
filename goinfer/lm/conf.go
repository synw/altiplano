package lm

import (
	llama "github.com/go-skynet/go-llama.cpp"
)

var DefaultInferenceParams = InferenceParams{
	Threads:           4,
	Tokens:            512,
	TopK:              40,
	TopP:              0.95,
	Temperature:       0.2,
	FrequencyPenalty:  0.0,
	PresencePenalty:   0.0,
	TailFreeSamplingZ: 1.0,
	StopPrompts:       []string{},
}

var DefaultModelParams = llama.ModelOptions{
	ContextSize: 1024,
	Embeddings:  false,
	NGPULayers:  0,
}
