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

let nullBox: null;

{
  /* ===================== fm ===================== */

  {
    // THROWS Expected 1-2 arguments, but got 0.
    fm()
  }

  {
    // THROWS Argument of type 'null' is not assignable to parameter of type 'string'.
    fm(null)
  }

  {
    // THROWS 'string' is not assignable to type 'boolean | undefined'.
    fm(file, {allowUnsafe: 'yes'})
  }

  {

    // THROWS 'FrontMatterResult<unknown>' is not assignable to type 'null'.
    nullBox = fm(file);

    // THROWS 'FrontMatterResult<Attributes>' is not assignable to type 'null'.
    nullBox = fm<Attributes>(file);
  }

  {
    
    let {attributes, body, bodyBegin, frontmatter} = fm<Attributes>(file);

    // THROWS Property 'foo' does not exist on type 'Attributes'.
    attributes.foo;

    // THROWS Type 'string' is not assignable to type 'null'.
    nullBox = body

    // THROWS Type 'number' is not assignable to type 'null'.
    nullBox = bodyBegin

    // THROWS Type 'string | undefined' is not assignable to type 'null'.
    nullBox = frontmatter
  }
}

{
  /* ===================== fm.test ===================== */

  {
    // THROWS 1 arguments, but got 0.
    fm.test()
  }

  {
    // THROWS Argument of type 'null' is not assignable to parameter of type 'string'.
    fm.test(null)
  }

  {
    // THROWS Type 'boolean' is not assignable to type 'null'.
    nullBox = fm.test(file)
  }
}

console.log(nullBox);