package main

import (
	"fmt"
	"os"
)

func printer(s string) error  {
	_, err := fmt.Fprint(os.Stdout, s)
	return err
}

func unused() {
	println("Not used")
}

func main() {
	printer("Ba dum, tss!")
}
