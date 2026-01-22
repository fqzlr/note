import fs from 'fs-extra'
import { Octokit } from '@octokit/rest'

// 1. 修改为你的 GitHub 用户名和仓库名
const owner = 'fqzlr'  // 
const repo = 'mm-notes' // 原：daily-notes


const octokit = new Octokit({
})

// （其他代码不变，以下仅修改路径相关）

/* 将 Issues 保存为 Markdown 文件 */
function generateIssueMarkdown(issue) {
  const content = issue.body.replace(
    /\n/,
    `

  :::tip 原文地址
  [${issue.title} | GitHub](${issue.html_url})
  :::
  `
  )

  // 3. 修改文件保存路径（适配你的 repo 名称）
  fs.writeFile(`./docs/${repo}/issue-${issue.number}.md`, content, 'utf8').then(() =>
    console.log(`Issue ${issue.number} generated successfully!`)
  )
}

/* 生成 index.md 文件 */
function generateIndexFile(data) {
  const issueYearGroups = Object.entries(data).sort(([year1], [year2]) => year2 - year1)
  const content = `# Daily Notes 日常笔记

日常笔记记录（零零散散啥都记系列）

> [新写一篇小笔记](https://github.com/${owner}/${repo}/issues/new)  // 4. 这里会自动适配你的仓库

共计 **${issueYearGroups.reduce(
    (total, [, issues]) => total + issues.length,
    0
  )}** 篇（上次更新: ${formatTime(issueYearGroups[0][1][0].created_at)}）

${issueYearGroups
  .map(
    ([year, issues]) => `## ${year} 年 (共计 ${issues.length} 篇)

${issues
  .map(
    (issue, index) =>
      `${index + 1}. ${formatTime(issue.created_at)} —— [${
        issue.title
      }](${`/${repo}/issue-${issue.number}`})` // 适配 repo 名称
  )
  .join('\n\n')}`
  )
  .join('\n\n')}
`

  // 3. 继续修改 index.md 保存路径
  fs.writeFile(`./docs/${repo}/index.md`, content, 'utf8').then(() =>
    console.log('Index file generated successfully!')
  )
}
