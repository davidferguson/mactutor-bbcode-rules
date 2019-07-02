import React from 'react'
import katex from 'katex'

/**
 * Render a Slate block.
 *
 * @param {Object} props
 * @return {Element}
 */
const RENDER_BLOCK = (props, editor, next) => {
  const { attributes, children, node } = props

  switch (node.type) {
    case 'heading-one':
      return <h1>{children}</h1>
    case 'heading-two':
      return <h2>{children}</h2>
    case 'heading-three':
      return <h3>{children}</h3>
    case 'heading-four':
      return <h4>{children}</h4>
    case 'heading-five':
      return <h5>{children}</h5>
    case 'heading-six':
      return <h6>{children}</h6>

    case 'paragraph':
      const color = node.data.get('color') ? node.data.get('color') : 'initial'
      return <p style={{backgroundColor: color}}>{children}</p>

    case 'list':
      return <ol>{children}</ol>
    case 'list-item':
      return <li>{children}</li>

    case 'quote':
      return <blockquote>{children}</blockquote>

    case 'center-paragraph':
      return <p style={{textAlign: 'center'}}>{children}</p>
    case 'indent-paragraph':
      return <p style={{margin: '1em 0 1em 40px'}}>{children}</p>
    case 'preformatted-paragraph':
      return <pre>{children}</pre>

    default:
      return next()
  }
}


/**
 * Render a Slate mark.
 *
 * @param {Object} props
 * @return {Element}
 */
const RENDER_MARK = (props, editor, next) => {
  const { children, mark, attributes } = props

  switch (mark.type) {
    case 'bold':
      return <b>{children}</b>
    case 'italic':
      return <i>{children}</i>
    case 'underline':
      return <u>{children}</u>
    case 'overline':
      return <span style={{textDecoration: 'overline'}}>{children}</span>

    case 'superscript':
      return <span style={{verticalAlign: 'sub'}}>{children}</span>
    case 'subscript':
      return <span style={{verticalAlign: 'super'}}>{children}</span>

    case 'link':
    case 'mlink':
    case 'wlink':
      return <span style={{color: '#0000ee', textDecoration: 'underline'}}>{children}</span>
    case 'gllink':
      return <span style={{color: 'green', textDecoration: 'underline'}}>{children}</span>
    case 'aclink':
      return <span style={{color: 'brown', textDecoration: 'underline'}}>{children}</span>

    case 'color':
      const color = mark.data.get('color') ? mark.data.get('color') : 'black'
      return <span style={{color: color}}>{children}</span>

    case 'big':
      return <span style={{fontSize: 'larger'}}>{children}</span>
    case 'small':
      return <span style={{fontSize: 'smaller'}}>{children}</span>

    case 'code':
      return <code>{children}</code>

    default:
      return next()
  }
}


/**
 * Render a Slate inline.
 *
 * @param {Object} props
 * @param {Editor} editor
 * @param {Function} next
 * @return {Element}
 */
const RENDER_INLINE = (props, editor, next) => {
  const { attributes, node, isFocused } = props
  switch (node.type) {
    case 'image':
      const src = node.data.get('src')
      return <img className="image" src={src} contentEditable={false} onDrop={e => e.preventDefault()} />

    case 'reference':
      const rnum = node.data.get('num')
      return <span className="reference" contentEditable={false} onDrop={e => e.preventDefault()}>[{rnum}]</span>

    case 'translation':
      const tnum = node.data.get('num')
      return <span className="translation" contentEditable={false} onDrop={e => e.preventDefault()}>&#9417;</span>

    case 'math':
      const mathraw = node.data.get('math')
      const html = katex.renderToString(mathraw, {throwOnError: false})
      return <span className="math" dangerouslySetInnerHTML={{__html: html}}></span>

    case 'anchor':
      const anchor = node.data.get('anchor')
      return <span className="anchor" contentEditable={false} onDrop={e => e.preventDefault()}>&#9398;</span>

    default:
      return next()
  }
}

export {
  RENDER_BLOCK,
  RENDER_MARK,
  RENDER_INLINE
}
