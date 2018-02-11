#!/bin/bash

# Only run if not in node_modules.
if [ \"${PWD##*/}\" != node_modules ]
then
  # Fix bad dependency link
  # `prism` should be `prismjs`
  ln -sf ./prismjs ./node_modules/prism
fi
