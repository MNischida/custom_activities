const JWT = require('jsonwebtoken');

module.exports = (body) => {
    if (!body) {
        return new Error('Invalid jwtdata');
    }

    console.log(body);

    console.log('Teste: ' + JSON.stringify(body))


    try {
        const decoded = JWT.verify(body.toString('utf8'), process.env.JWT);
        console.log('Token verificado com sucesso:', decoded);
      } catch (error) {
        console.error('Erro na verificação do token:', error.message);
      }

    // return JWT.verify(body.toString('utf8'), process.env.JWT, {
    //     algorithm: 'HS256'
    // });
};