---
title: A basic example
description: You can use the front-matter module to convert this
tags: [example, yaml, node]
foldedText |
  There once was a man from Darjeeling
  Who got on a bus bound for Ealing
      It said on the door
      "Please don't spit on the floor"
  So he carefully spat on the ceiling
wrappedText >
  Wrapped text
  will be folded
  into a single
  paragraph

  Blank lines denote
  paragraph breaks
---

Using the front-matter module you can access YAML attributes defined at the top of a string the way this file shows, YAML attributes must be defined at the top and between a set of three dashes "---".

When you read this file and run it's contents through `front-matter` you will receive an object with two keys, `attributes` and `body`. The `attributes` key will contain the YAML attributes and the `body` will contain the remaining file contents.

This module is intentionally small and leaves out things like reading the file, this allows you the flexibility to use your preferred file reading method and get really creative with mixing in formats and templating languages. For example these three paragraphs will be the `body` and can be treated as a Mustache template which could be populated from the YAML attributes and then parsed through Markdown.

{{#tags}}
* {{.}}
{{/tags}}
