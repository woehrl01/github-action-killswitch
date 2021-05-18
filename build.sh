#!/bin/bash

ncc build -o dist/killid action/killid.js --license licenses.txt

ncc build -o dist/wait action/wait.js --license licenses.txt