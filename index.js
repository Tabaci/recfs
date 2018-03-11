
const fs = require('fs')
const path = require('path')

/**
 * Read a directory recursively async.
 * 
 * @param {string} directory - The directory to read recursively.
 * @param {Object.<>} options - @see fs.readdir
 * @param {RegExp} regex - Regular expression to validate file names with. If 
 *        the regular expression does not match the name of the file (including 
 *        the extension), the file will not be returned.
 * 
 * @return {Promise}
 */
module.exports.readdir = function (directory, options, regex)
{
	return new Promise((resolve, reject) => {
		let filesToProcess = 0
		let toReturn = []
		let isResolved = false
		
		let readLevel = (directory, cb) => {
			fs.readdir(directory, options, (err, files) => {
				if (err)
				{
					reject(err)
					
					return
				}
				
				// Number of files to process
				filesToProcess += files.length
				
				if (cb !== undefined)
					cb()
				
				for (let i = 0; i < files.length; i ++)
				{
					let file = files[i]
					let filePath = path.join(directory, file)
					
					// Get stats from file
					fs.lstat(filePath, (err, stats) => {
						if (err)
						{
							reject(err)
							
							return
						}
						
						if (stats.isDirectory())
						{
							readLevel(filePath, () => {
								filesToProcess --
								
								if (filesToProcess === 0)
									resolve(toReturn)
							})
						}
						else
						{
							// Is a file
							
							if (regex === undefined || regex.test(file))
								toReturn.push(filePath)
							
							filesToProcess --
							
							if (filesToProcess === 0)
								resolve(toReturn)
						}
					})
				}
			})
		}
		
		readLevel(directory)
	})
}

/**
 * Read a directory recursively sync.
 * 
 * @param {string} directory - The directory to read recursively.
 * @param {Object.<>} options - @see fs.readdir
 * @param {RegExp} regex - Regular expression to validate file names with. If 
 *        the regular expression does not match the name of the file (including 
 *        the extension), the file will not be returned.
 */
module.exports.readdirSync = function (directory, options, regex)
{
	let toReturn = []
	
	let readLevel = (directory) => 
	{
		let files = fs.readdirSync(directory, options)
		
		for (let file of files)
		{
			let filePath = path.join(directory, file)
			
			// Get stats from file
			let stats = fs.lstatSync(filePath)
			
			if (stats.isDirectory())
				readLevel(filePath)
			else
			{
				// Is a file
				
				if (regex === undefined || regex.test(file))
					toReturn.push(filePath)
			}
		}
	}
	
	readLevel(directory)
	
	return toReturn
}
