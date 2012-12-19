
describe('fm(string)', function(){
  it('parses yaml delinetead by `---`')
  it('parses yaml delinetead by `= yaml =`')

  describe('when there is front matter', function(){
    it('populates `content.yaml`')
    it('populates `content.body`')
  })

  describe('when there is NOT front matter', function(){
    it('has an empty `content.yaml` object')
    it('populates `content.body`')
  })

  describe('when the front matter is actually back matter', function(){
    it('does NOT blow up')
    it('happily parses')
  })
})
