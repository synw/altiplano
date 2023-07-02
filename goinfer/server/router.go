package server

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func RunServer(origins []string) {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     origins,
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAuthorization},
		AllowMethods:     []string{http.MethodGet, http.MethodOptions, http.MethodPost},
		AllowCredentials: true,
	}))

	// inference
	inf := e.Group("/infer")
	inf.POST("", InferHandler)
	inf.GET("/abort", AbortHandler)
	// models
	mod := e.Group("/model")
	mod.GET("/state", ModelsStateHandler)
	mod.POST("/load", LoadModelHandler)

	e.Logger.Fatal(e.Start(":5143"))
}
