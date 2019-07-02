import katex from 'katex'

const BBCODE_TAGS = [
  // blocks
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'ol',
  'item',
  'quote',
  'center',
  'ind',
  'pre',

  // marks
  'url',
  'b',
  'i',
  'u',
  'ovl',
  'sup',
  'sub',
  'm',
  'w',
  'gl',
  'ac',
  'color',
  'big',
  'small',
  'code',

  // inline
  'img',
  'ref',
  't',
  'math',
  'anchor'
]

const BBCODE_RULES = [
  {
    // blocks
    serialize (obj, children) {
      if (obj.object !== 'block') return

      switch (obj.type) {
        case 'heading-one':
          return `[h1]${children}[/h1]`
        case 'heading-two':
          return `[h2]${children}[/h2]`
        case 'heading-three':
          return `[h3]${children}[/h3]`
        case 'heading-four':
          return `[h4]${children}[/h4]`
        case 'heading-five':
          return `[h5]${children}[/h5]`
        case 'heading-six':
          return `[h6]${children}[/h6]`

        case 'paragraph':
          const color = obj.data.get('color')
          const openTag = `[p${color ? '=' + color : ''}]`
          return `${openTag}${children}[/p]`

        case 'list':
          return `[list]${children}[/list]`
        case 'list-item':
          return `[item]${children}[/item]`

        case 'quote':
          return `[quote]${children}[/quote]`

        case 'center-paragraph':
          return `[center]${children}[/center]`
        case 'indent-paragraph':
          return `[ind]${children}[/ind]`
        case 'preformatted-paragraph':
          return `[pre]${children}[/pre]`
      }
    },
    deserialize (node, next) {
      const {tag, attrs} = node
      let children
      switch (tag) {
        case 'h1':
          return {object: 'block', type: 'heading-one', data: {}, nodes: next(node.content)}
        case 'h2':
          return {object: 'block', type: 'heading-two', data: {}, nodes: next(node.content)}
        case 'h3':
          return {object: 'block', type: 'heading-three', data: {}, nodes: next(node.content)}
        case 'h4':
          return {object: 'block', type: 'heading-four', data: {}, nodes: next(node.content)}
        case 'h5':
          return {object: 'block', type: 'heading-five', data: {}, nodes: next(node.content)}
        case 'h6':
          return {object: 'block', type: 'heading-six', data: {}, nodes: next(node.content)}

        case 'p':
          const keys = Object.keys(attrs)
          const data = (keys.length === 1) ? {color: keys[0]} : {}
          return {object: 'block', type: 'paragraph', data: data, nodes: next(node.content)}

        case 'list':
          children = next(node.content).filter(child => child.type === 'list-item')
          return {object: 'block', type: 'list', data: {}, nodes:children }
        case 'item':
          return {object: 'block', type: 'list-item', data: {}, nodes: next(node.content)}

        case 'quote':
          return {object: 'block', type: 'quote', data: {}, nodes: next(node.content)}

        case 'center':
          return {object: 'block', type: 'center-paragraph', data: {}, nodes: next(node.content)}
        case 'ind':
          return {object: 'block', type: 'indent-paragraph', data: {}, nodes: next(node.content)}
        case 'pre':
          return {object: 'block', type: 'preformatted-paragraph', data: {}, nodes: next(node.content)}
      }
    }
  },
  {
    // marks
    serialize (obj, children) {
      if (obj.object !== 'mark') return

      switch (obj.type) {
        case 'link':
          const href = obj.data.get('href')
          return `[url=${href}]${children}[/url]`

        case 'bold':
          return `[b]${children}[/b]`
        case 'italic':
          return `[i]${children}[/i]`
        case 'underline':
          return `[u]${children}[/u]`
        case 'overline':
          return `[ovl]${children}[/ovl]`

        case 'superscript':
          return `[sup]${children}[/sup]`
        case 'subscript':
          return `[sub]${children}[/sub]`

        case 'mlink': {
          const name = obj.data.get('name')
          const openTag = `[m${name ? '=' + name : ''}]`
          return `${openTag}${children}[/m]`
        }
        case 'wlink': {
          const name = obj.data.get('name')
          const openTag = `[w${name ? '=' + name : ''}]`
          return `${openTag}${children}[/w]`
        }
        case 'gllink': {
          const file = obj.data.get('file')
          const openTag = `[gl=${file}]`
          return `${openTag}${children}[/gl]`
        }
        case 'aclink': {
          const name = obj.data.get('name')
          const openTag = `[ac=${name}]`
          return `${openTag}${children}[/ac]`
        }

        case 'color':
          const color = obj.data.get('color')
          return `[color=${color}]${children}[/color]`

        case 'big':
          return `[big]${children}[/big]`
        case 'small':
          return `[small]${children}[/small]`

        case 'code':
          return `[code]${children}[/code]`
      }
    },
    deserialize (node, next) {
      const {tag, attrs} = node
      switch (tag) {
        case 'url':
          const keys = Object.keys(attrs)
          const data = (keys.length === 1) ? {href: keys[0]} : {}
          return {object: 'mark', type: 'link', data: data, nodes: next(node.content)}

        case 'b':
          return {object: 'mark', type: 'bold', data: {}, nodes: next(node.content)}
        case 'i':
          return {object: 'mark', type: 'italic', data: {}, nodes: next(node.content)}
        case 'u':
          return {object: 'mark', type: 'underline', data: {}, nodes: next(node.content)}
        case 'ovl':
          return {object: 'mark', type: 'overline', data: {}, nodes: next(node.content)}

        case 'sup':
          return {object: 'mark', type: 'superscript', data: {}, nodes: next(node.content)}
        case 'sub':
          return {object: 'mark', type: 'subscript', data: {}, nodes: next(node.content)}

        case 'm': {
          const keys = Object.keys(attrs)
          const data = (keys.length === 1) ? {name: keys[0]} : {}
          return {object: 'mark', type: 'mlink', data: data, nodes: next(node.content)}
        }
        case 'w': {
          const keys = Object.keys(attrs)
          const data = (keys.length === 1) ? {name: keys[0]} : {}
          return {object: 'mark', type: 'wlink', data: data, nodes: next(node.content)}
        }
        case 'gl': {
          const keys = Object.keys(attrs)
          const data = {file: keys[0]}
          return {object: 'mark', type: 'gllink', data: data, nodes: next(node.content)}
        }
        case 'ac': {
          const keys = Object.keys(attrs)
          const data = {name: keys[0]}
          return {object: 'mark', type: 'aclink', data: data, nodes: next(node.content)}
        }

        case 'color': {
          const keys = Object.keys(attrs)
          const data = (keys.length === 1) ? {color: keys[0]} : {}
          return {object: 'mark', type: 'color', data: data, nodes: next(node.content)}
        }

        case 'big':
          return {object: 'mark', type: 'big', data: {}, nodes: next(node.content)}
        case 'small':
          return {object: 'mark', type: 'small', data: {}, nodes: next(node.content)}

        case 'code':
          return {object: 'mark', type: 'code', data: {}, nodes: next(node.content)}
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
          return `[img]${src}[/small]`

        case 'reference':
          const rnum = obj.data.get('num')
          return `[ref]${rnum}[/ref]`

        case 'translation':
          const tnum = obj.data.get('num')
          return `[t]${tnum}[/t]`

        case 'math':
          const math = obj.data.get('math')
          return `[math]${math}[/math]`

        case 'anchor':
          const anchor = obj.data.get('anchor')
          return `[anchor]${anchor}[/anchor]`
      }
    },
    deserialize (node, next) {
      const {tag, attrs} = node
      switch (tag) {
        case 'img': {
          const content = next(node.content)
          const textval = content.filter(node => node.object === 'text')
                                 .reduce((val, node) => val + node.text, '')
          return {object: 'inline', type: 'image', data: {src: textval}, nodes: content}
        }
        case 'ref': {
          const content = next(node.content)
          const textval = content.filter(node => node.object === 'text')
                                 .reduce((val, node) => val + node.text, '')
          return {object: 'inline', type: 'reference', data: {num: textval}, nodes: content}
        }
        case 't': {
          const content = next(node.content)
          const textval = content.filter(node => node.object === 'text')
                                 .reduce((val, node) => val + node.text, '')
          return {object: 'inline', type: 'translation', data: {num: textval}, nodes: content}
        }
        case 'math': {
          const content = next(node.content)
          const textval = content.filter(node => node.object === 'text')
                                 .reduce((val, node) => val + node.text, '')
          return {object: 'inline', type: 'math', data: {math: textval}, nodes: content}
        }
        case 'anchor': {
          const content = next(node.content)
          const textval = content.filter(node => node.object === 'text')
                                 .reduce((val, node) => val + node.text, '')
          return {object: 'inline', type: 'anchor', data: {anchor: textval}, nodes: content}
        }
      }
    }
  },
  {
    serialize (obj, children) {
      console.error('not matched', obj)
    }
  }
]

export {
  BBCODE_TAGS,
  BBCODE_RULES
}
