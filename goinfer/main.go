package main

import (
	"flag"
	"fmt"

	"github.com/synw/altiplano/goinfer/conf"
	"github.com/synw/altiplano/goinfer/server"
	"github.com/synw/altiplano/goinfer/state"
	"github.com/synw/altiplano/goinfer/ws"
)

func main() {
	verbose := flag.Bool("v", false, "verbose mode")
	noWs := flag.Bool("nows", false, "disable the websockets")
	flag.Parse()

	if *verbose {
		state.IsVerbose = *verbose
	}
	if !*noWs {
		go ws.RunWs()
	} else {
		state.UseWs = false
	}
	conf := conf.InitConf()
	state.ModelsDir = conf.ModelsDir
	/*if len(*loadModel) > 0 {
		mpath := filepath.Join(lm.ModelsDir, *loadModel)
		fmt.Println("Loading model " + mpath)
		lm.LoadModel(mpath, 512, 0)
	}*/
	if *verbose {
		fmt.Println("Starting the http server with allowed origins", conf.Origins)
	}
	server.RunServer(conf.Origins)
}
