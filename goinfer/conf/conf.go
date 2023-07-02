package conf

import (
	"fmt"

	"github.com/spf13/viper"
)

type GoInferConf struct {
	ModelsDir string
	Origins   []string
}

func InitConf() GoInferConf {
	viper.SetConfigName("goinfer.config")
	viper.AddConfigPath(".")
	viper.SetDefault("origins", []string{"localhost"})
	err := viper.ReadInConfig() // Find and read the config file
	if err != nil {             // Handle errors reading the config file
		panic(fmt.Errorf("fatal error config file: %w", err))
	}
	md := viper.GetString("models_dir")
	or := viper.GetStringSlice("origins")
	return GoInferConf{
		ModelsDir: md,
		Origins:   or,
	}
}
