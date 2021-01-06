/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Handlebars = require("handlebars");
const {gen_nav, gen_header, gen_footer} = require('../handlebar_helpers');
const HTML_PATH = path.join(__dirname, '../../src/html/');
const EXTENSION_REGEX = /\.hbs$/i;

Handlebars.registerHelper('nav', gen_nav);
Handlebars.registerHelper('header', gen_header);
Handlebars.registerHelper('footer', gen_footer);

/**
 * A recursive function that looks for files that match a given filter.
 * Goes through subdirectories.
 * 
 * @param {string} startPath 
 * @param {RegExp} filter 
 * @returns {string[]} the file paths that match the target filter, where 
 * the first item is the fileName and the second the filePath.
 */
function fetchHBSFiles(startPath, filter) {
  if (!fs.existsSync(startPath)){
    console.log("(`html_build` error) No directory at starting path: ", startPath);
    return;
  }

  const files = fs.readdirSync(startPath);
  const matchedFiles = [];
  for(const file of files){
    const filePath = path.join(startPath, file);
    const stat = fs.lstatSync(filePath);
    if (stat.isDirectory()){
      fetchHBSFiles(filePath, filter)
      matchedFiles.push(...fetchHBSFiles(filePath, filter));
    } else if (filter.test(file)) {
      console.log('-- found: ', file);
      matchedFiles.push([file.slice(0, file.length - 4), filePath]);
    }
  }
  return matchedFiles;
}

/**
 * Gets src of a given array of files.
 * 
 * @argument {string[]} files an array of files
 * @returns {string[]}
 */
function fileResolverAsync(files) {
  return files.map(file => fs.readFileSync(file[1], {encoding: 'utf-8'}));
}

function buildPlugins(startingPath, filter) {
  const plugins = [];
  const files = fetchHBSFiles(startingPath, filter);
  const htmlData = fileResolverAsync(files)
  for(let i=0; i< htmlData.length;i++) {
    const html = htmlData[i].toString();
    const title = files[i][0];
    const template = Handlebars.compile(html);
    const templateContent = template({ title });
    plugins.push(new HtmlWebpackPlugin({
      filename: title + '.html',
      templateContent
    }))
  }
  return plugins
}

module.exports = buildPlugins(HTML_PATH, EXTENSION_REGEX);