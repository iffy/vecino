
all: vecino.lhtml

vecino.lhtml: src/*
	webpack
	cd src && zip ../vecino.lhtml *
