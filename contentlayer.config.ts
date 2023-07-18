import { ComputedFields, defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { rehypePrettyCodeOptions } from './lib/theme/rehypePrettyCode';
import { visit } from 'unist-util-visit';
import rehypeImgSize from 'rehype-img-size';

const computedFields: ComputedFields = {
	slug: {
		type: 'string',
		resolve: (doc) => `/${doc._raw.flattenedPath}`
	},
	slugAsParams: {
		type: 'string',
		resolve: (doc) => doc._raw.flattenedPath.split('/').slice(1).join('/')
	}
};

export const Page = defineDocumentType(() => ({
	name: 'Page',
	filePathPattern: `pages/**/*.mdx`,
	contentType: 'mdx',
	fields: {
		title: {
			type: 'string',
			required: true
		},
		description: {
			type: 'string'
		}
	},
	computedFields
}));

export const Post = defineDocumentType(() => ({
	name: 'Post',
	filePathPattern: `posts/**/*.mdx`,
	contentType: 'mdx',
	fields: {
		title: {
			type: 'string',
			required: true
		},
		date: {
			type: 'date',
			required: true
		},
		description: {
			type: 'string',
			required: true
		},
		tags: {
			type: 'list',
			required: true,
			description: 'Tags of the post',
			of: {
				type: 'string'
			}
		},
		featured: {
			type: 'boolean'
		}
	},
	computedFields
}));

export default makeSource({
	contentDirPath: './content',
	documentTypes: [Post, Page],
	mdx: {
		remarkPlugins: [
			remarkGfm,
			remarkMath // to support math in md
		],
		rehypePlugins: [
			rehypeSlug,
			// pretty code [BEGIN]
			() => (tree) => {
				visit(tree, (node) => {
					if (node?.type === 'element' && node?.tagName === 'pre') {
						const [codeEl] = node.children;
						if (codeEl.tagName !== 'code') {
							return;
						}

						if (codeEl.data?.meta) {
							// Extract event from meta and pass it down the tree.
							const regex = /event="([^"]*)"/;
							const match = codeEl.data?.meta.match(regex);
							if (match) {
								node.__event__ = match ? match[1] : null;
								codeEl.data.meta = codeEl.data.meta.replace(regex, '');
							}
						}

						node.__rawString__ = codeEl.children?.[0].value;
					}
				});
			},
			[rehypePrettyCode, rehypePrettyCodeOptions],
			() => (tree) => {
				visit(tree, (node) => {
					if (node?.type === 'element' && node?.tagName === 'div') {
						if (!('data-rehype-pretty-code-fragment' in node.properties)) {
							return;
						}

						const preElement = node.children.at(-1);
						if (preElement.tagName !== 'pre') {
							return;
						}

						preElement.properties['__rawString__'] = node.__rawString__;
					}
				});
			},
			// pretty code [END]

			// https://github.com/remarkjs/remark-math/tree/main
			// render math to html; 👉KaTeX requires CSS to render correctly.
			rehypeKatex,

			/*
			 to add height and width information of our images to the markdown as we load it
			 https://ironeko.com/posts/how-to-use-next-js-image-with-markdown-or-mdx
			*/
			// @ts-ignore
			[rehypeImgSize, { dir: 'public' }]
		]
	}
});
