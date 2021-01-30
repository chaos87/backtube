import { baseURL } from '../../config/urls';

export const uploadImageToS3 = async (input) => {
    let uploadResponse = input.file;
    const accessToken = input.accessToken;
    const folder = input.folder;
    if (input.file !== null && input.file !== undefined
        && input.file instanceof Object) {
        let fileParts = input.file.name.split('.');
        let fileName = folder + '/' + input.id;
        let fileType = fileParts[1];

        const uploadUrl = baseURL + `/api/uploadAvatar`;
        uploadResponse = await fetch(uploadUrl, {method: 'POST',
            body: JSON.stringify({
                fileName: fileName,
                fileType: fileType
            }),
            headers: {
              'Content-Type': 'application/json',
              'accessToken': accessToken
            }
        })
        .then(response => {
            return response.json()
        })
        .then(response => {
          const signedRequest = response.signedRequest;
          const url = response.url;
          console.log("Received a signed request " + signedRequest);
          let putResult = fetch(signedRequest,{method: 'PUT',
              body: input.file,
              headers: {
                'Content-Type': fileType
              }
            })
            .then(result => {
              return url
            })
            .catch(error => {
              return error
            })
            return putResult;
        });
    }
    return uploadResponse;
}
