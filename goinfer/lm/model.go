package lm

import (
	"errors"
	"fmt"
	"path/filepath"

	llama "github.com/go-skynet/go-llama.cpp"
	"github.com/synw/altiplano/goinfer/state"
)

func LoadModel(model string, params llama.ModelOptions) error {
	mpath := filepath.Join(state.ModelsDir, model+".bin")
	if state.IsVerbose {
		fmt.Println("Loading model", mpath)
	}
	lm, err := llama.New(
		mpath,
		llama.SetContext(params.ContextSize),
		llama.EnableEmbeddings,
		llama.SetGPULayers(params.NGPULayers),
	)
	if err != nil {
		return errors.New("can not load model " + model)
	}
	state.Lm = lm
	state.CtxSize = params.ContextSize
	state.IsModelLoaded = true
	state.LoadedModel = model
	return nil
}
