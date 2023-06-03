

export const fileFilter = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {
  console.log({ file })
  if ( !file ) return callback(new Error('File is empty'), false)

  const fileExt = file.mimetype.split('/')[1]
  const validExt = ['jpg', 'jpeg', 'png']

  if ( validExt.includes( fileExt )) {
    return callback( null, true )
  }

  return callback(null, false)
}