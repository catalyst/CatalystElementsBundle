#!/bin/bash

# Fix bad dependency links
# These should only be temp fixes until Polymer 3.0 is released.

# `prism` should be `prismjs`
ln -sf ./prismjs ./node_modules/prism
