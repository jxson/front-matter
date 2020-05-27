import fm from '../'

type Attributes = {
  title: string,
  description: string
}

const file = `
---
title: Just hack'n
description: Nothing to see here
---

This is some text about some stuff that happened sometime ago`;

{
  /* ===================== fm ===================== */

  {
    fm(file)
  }

  {
    const { attributes, body, bodyBegin, frontmatter } = fm<Attributes>(file);
    console.log(attributes.title);
    console.log(attributes.description);
    console.log(body);
    console.log(bodyBegin);
    console.log(frontmatter);
  }

  {
    fm(file)
  }

  {
    fm(file, {allowUnsafe: true})
  }
}

{
  /* ===================== fm.test ===================== */

  {
    fm.test(file)
  }

  {
    let resultTest: boolean;

    resultTest = fm.test(file);
    console.log(resultTest);
  }
}