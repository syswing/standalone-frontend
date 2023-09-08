import React from 'react';
import * as MarkdownIt from 'markdown-it'
import 'github-markdown-css/github-markdown.css'

const markdownIt = new MarkdownIt();

export default ({mdContent}) => {

	const html = markdownIt.render(mdContent)

	return <div className="markdown-body" dangerouslySetInnerHTML={{
		__html:html
	}}></div>
}
