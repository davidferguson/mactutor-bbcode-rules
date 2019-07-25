import React from 'react'
import katex from 'katex'

function purge_mlink (s) {
  // The below code is modified from the original htmlformat function
  // to ensure compatibility
  const rawch   = ['á','à','â','ä','ã','Á','Â','Ä','é','è','ê','ë','É','î','í','ó','ô','ö','ò','õ','Ö','û','ú','ü','ù','Ü','ç','ï','ø','Ø','ñ']
  const transch = ['a','a','a','a','a','A','A','A','e','e','e','e','E','i','i','o','o','o','o','o','O','u','u','u','u','U','c','i','o','O','n']
  for (let i = 0; i < rawch.length; i++) {
    const raw = rawch[i]
    const trans = transch[i]
    s = s.replace(raw, trans)
  }
  return s
}

const HTML_RULES = [
  {
    // blocks
    serialize (obj, children) {
      if (obj.object !== 'block') return

      switch (obj.type) {
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
          const color = obj.data.get('color') ? obj.data.get('color') : 'initial'
          return <p style={{backgroundColor: color}}>{children}</p>

        case 'list':
          return <ol>{children}</ol>
        case 'list-item':
          return <li>{children}</li>

        case 'quote':
          return <blockquote>{children}</blockquote>

        case 'center-paragraph':
          return <p className="center-paragraph">{children}</p>
        case 'indent-paragraph':
          return <p className="indent-paragraph">{children}</p>
        case 'preformatted-paragraph':
          return <pre>{children}</pre>

        case 'inlineblock':
          return children
      }
    }
  },
  {
    // marks
    serialize (obj, children) {
      if (obj.object !== 'mark') return

      switch (obj.type) {
        case 'link':
          const href = obj.data.get('href') ? obj.data.get('href') : '#'
          return <a href={href}>{children}</a>

        case 'bold':
          return <b>{children}</b>
        case 'italic':
          return <i>{children}</i>
        case 'underline':
          return <u>{children}</u>
        case 'overline':
          return <span className="overline">{children}</span>

        case 'superscript':
          return <span className="superscript">{children}</span>
        case 'subscript':
          return <span className="superscript">{children}</span>

        case 'mlink': {
          let name = obj.data.get('name')
          if (!name && children) {
            if (!Array.isArray(children)) {
              console.error('mlink on non-array', children)
              name = ''
            } else {
              name = children.filter(node => typeof node === 'string').pop()
            }
          }
          let lastWord = name.split(' ').pop()
          let formatted = purge_mlink(lastWord)
          return <a className="mlink" href={'/Biographies/' + formatted}>{children}</a>
        }
        case 'wlink': {
          let name = obj.data.get('name')
          if (!name && children) {
            if (!Array.isArray(children)) {
              console.error('mlink on non-array', children)
              name = ''
            } else {
              name = children.filter(node => typeof node === 'string').pop()
            }
          }
          let lastWord = name.split(' ').pop()
          let formatted = purge_mlink(lastWord)
          return <a className="wlink" href={'/Biographies/' + formatted}>{children}</a>
        }
        case 'gllink':
          let file = obj.data.get('file')
          return <a className="gllink" href={'/glossary/' + file}>{children}</a>
        case 'aclink': {
          let name = obj.data.get('name')
          return <a className="aclink" href={'/academy/' + name}>{children}</a>
        }

        case 'color':
          const color = obj.data.get('color') ? obj.data.get('color') : 'black'
          return <span style={{color: color}}>{children}</span>

        case 'big':
          return <span className="bigger">{children}</span>
        case 'small':
          return <span className="smaller">{children}</span>

        case 'code':
          return <code>{children}</code>
      }
    }
  },
  {
    // inlines
    serialize (obj, children) {
      if (obj.object !== 'inline') return

      switch (obj.type) {
        case 'image':
          const src = obj.data.get('src')
          return <img className="image" src={src} alt="" />

        case 'reference':
          const rnum = obj.data.get('num')
          return (<span>[<a href={'#reference-' + rnum} className="reference">{rnum}</a>]</span>)

        case 'translation':
          const translationText = obj.data.get('num')
          return (
            <span>
              <a data-type="translation" data-translation={translationText} className="translation nonoscript">&#9417;</a>
              <noscript>({translationText})</noscript>
            </span>
          )

        case 'math':
          const mathraw = obj.data.get('math')
          const html = katex.renderToString(mathraw, {throwOnError: false})
          return <span className="math" dangerouslySetInnerHTML={{__html: html}}></span>

        case 'anchor':
          const anchor = obj.data.get('anchor')
          return <a name={anchor}></a>
      }
    }
  }
]

export default HTML_RULES
