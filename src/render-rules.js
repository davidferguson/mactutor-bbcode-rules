import React from 'react'
import katex from 'katex'
import { Range } from 'slate'

/**
 * Render a Slate block.
 *
 * @param {Object} props
 * @return {Element}
 */
const RENDER_BLOCK = (props, editor, next) => {
  const { children, node } = props

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

    case 'inlineblock':
      return <p>{children}</p>

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
  const { children, mark } = props

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
      return <span style={{verticalAlign: 'super'}}>{children}</span>
    case 'subscript':
      return <span style={{verticalAlign: 'sub'}}>{children}</span>

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

function clickHandler (node, editor) {
  let start = editor.value.selection.start
  start = start.moveToStartOfNode(node)
  let end = editor.value.selection.end
  end = end.moveToEndOfNode(node)

  const r = Range.fromJSON({
    anchor: start,
    focus: end
  })

  editor.select(r)
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
  const { node, isFocused } = props

  switch (node.type) {
    case 'image':
      const src = node.data.get('src')
      return <img onClick={() => {clickHandler(node, editor)}} alt="" className="image" src={src} contentEditable={false} onDrop={e => e.preventDefault()} style={{outline: isFocused ? '1px solid red' : 'none', cursor: 'pointer'}} />

    case 'reference':
      const rnum = node.data.get('num')
      return <span onClick={() => {clickHandler(node, editor)}} className="reference" contentEditable={false} onDrop={e => e.preventDefault()} style={{outline: isFocused ? '1px solid red' : 'none', cursor: 'pointer'}}>[{rnum}]</span>

    case 'translation':
      //const tnum = node.data.get('num')
      return <span onClick={() => {clickHandler(node, editor)}} className="translation" contentEditable={false} onDrop={e => e.preventDefault()} style={{outline: isFocused ? '1px solid red' : 'none', cursor: 'pointer'}}>&#9417;</span>

    case 'math':
      const mathraw = node.data.get('math')
      const html = katex.renderToString(mathraw, {throwOnError: false})
      return <span onClick={() => {clickHandler(node, editor)}} className="math" dangerouslySetInnerHTML={{__html: html}} style={{outline: isFocused ? '1px solid red' : 'none', cursor: 'pointer'}}></span>

    case 'anchor':
      //const anchor = node.data.get('anchor')
      return <span onClick={() => {clickHandler(node, editor)}} className="anchor" contentEditable={false} onDrop={e => e.preventDefault()} style={{outline: isFocused ? '1px solid red' : 'none', cursor: 'pointer'}}>&#9398;</span>

    default:
      return next()
  }
}

export {
  RENDER_BLOCK,
  RENDER_MARK,
  RENDER_INLINE
}
