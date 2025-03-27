import emotionStyled from '@emotion/styled'

const Quote = emotionStyled.i((props) => {
  return {
    wordBreak: 'break-word',
    fontWeight: '800',
    display: 'inline-block',
    // @ts-ignore
    float: props.float || 'left',
  }
})

export default Quote
