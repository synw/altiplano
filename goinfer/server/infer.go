package server

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/synw/altiplano/goinfer/lm"
	"github.com/synw/altiplano/goinfer/state"
)

func parseInferParams(m echo.Map) (string, string, lm.InferenceParams, error) {
	v, ok := m["prompt"]
	if !ok {
		return "", "", lm.InferenceParams{}, errors.New("provide a prompt")
	}
	prompt := v.(string)
	template := "{prompt}"
	v, ok = m["template"]
	if ok {
		template = v.(string)
	}
	threads := lm.DefaultInferenceParams.Threads
	v, ok = m["threads"]
	if ok {
		threads = v.(int)
	}
	tokens := lm.DefaultInferenceParams.Tokens
	v, ok = m["tokens"]
	if ok {
		tokens = v.(int)
	}
	topK := lm.DefaultInferenceParams.TopK
	v, ok = m["topK"]
	if ok {
		topK = v.(int)
	}
	topP := lm.DefaultInferenceParams.TopP
	v, ok = m["topP"]
	if ok {
		topP = v.(float64)
	}
	temp := lm.DefaultInferenceParams.Temperature
	v, ok = m["temp"]
	if ok {
		temp = v.(float64)
	}
	freqPenalty := lm.DefaultInferenceParams.FrequencyPenalty
	v, ok = m["frequencyPenalty"]
	if ok {
		freqPenalty = v.(float64)
	}
	presPenalty := lm.DefaultInferenceParams.PresencePenalty
	v, ok = m["presencePenalty"]
	if ok {
		presPenalty = v.(float64)
	}
	tfs := lm.DefaultInferenceParams.TailFreeSamplingZ
	v, ok = m["tfs"]
	if ok {
		tfs = v.(float64)
	}
	stop := lm.DefaultInferenceParams.StopPrompts
	v, ok = m["stop"]
	if ok {
		tfs = v.(float64)
	}
	params := lm.InferenceParams{
		Threads:           threads,
		Tokens:            tokens,
		TopK:              topK,
		TopP:              topP,
		Temperature:       temp,
		FrequencyPenalty:  freqPenalty,
		PresencePenalty:   presPenalty,
		TailFreeSamplingZ: tfs,
		StopPrompts:       stop,
	}
	return prompt, template, params, nil
}

func InferHandler(c echo.Context) error {
	if state.IsInfering {
		fmt.Println("An inference query is already running")
		return c.NoContent(http.StatusAccepted)
	}
	m := echo.Map{}
	if err := c.Bind(&m); err != nil {
		return err
	}

	prompt, template, params, err := parseInferParams(m)
	if err != nil {
		panic(err)
	}
	res, err := lm.Infer(prompt, template, params)
	if err != nil {
		panic(err)
	}

	//fmt.Println("-------- result ----------")
	//fmt.Println(res)
	//fmt.Println("--------------------------")

	return c.JSON(http.StatusOK, res)
}

func AbortHandler(c echo.Context) error {
	if !state.IsInfering {
		fmt.Println("No inference running, nothing to abort")
		return c.NoContent(http.StatusAccepted)
	}
	if state.IsVerbose {
		fmt.Println("Aborting inference")
	}
	state.ContinueInferingController = false
	return c.NoContent(http.StatusNoContent)
}
