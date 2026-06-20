class TokenManager {
    static cycles = 14

    static returnNewUID() {
        return crypto.randomUUID().replaceAll('-','')
    }

    static buildEncodedToken(info) {
        let iteration = 0
        let encodedToken = ''
        const dataString = `${info.userEmail}|${info.userId}|${info.createdAt}`
        encodedToken = dataString

        while (iteration <= this.cycles) {
            encodedToken = btoa(encodedToken)
            iteration++
        }

        const tokenId = {
            token: encodedToken.split('').reverse().join('').replaceAll('=', '')
        }

        return tokenId
    }

    static checkEncodedToken(token) {
        try {
            // 1. Revertir el proceso de reversión y padding inicial
            let decodedToken = token.split('').reverse().join('')

            // Asegurar que la longitud sea múltiplo de 4 para atob()
            const padLength = (4 - (decodedToken.length % 4)) % 4;
            for (let i = 0; i < padLength; i++) {
                decodedToken += '='
            }

            // 2. Decodificar repetidamente (el inverso de btoa)
            let iteration = 0
            while (iteration <= this.cycles) {
                decodedToken = atob(decodedToken)
                iteration++
            }

            const [userEmail, userId, createdAt] = decodedToken.split('|')

            return {
                valid: true,
                data: { userEmail, userId, createdAt }
            }

        } catch (error) {
            console.error("Error decoding token:", error)
            return {
                valid: false,
                error: "The current token is invalid or damaged."
            }
        }
    }
}

export default TokenManager