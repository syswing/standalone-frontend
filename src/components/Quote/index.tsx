import emotionStyled from '@emotion/styled'

const Quote = emotionStyled.i(({ float }: any) => {
  return {
    wordBreak: 'keep-all',
    fontWeight: '800',
    display: 'inline-block',
    float: float || 'left',
  }
})

export default Quote
