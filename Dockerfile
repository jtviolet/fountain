FROM lambci/lambda:build-nodejs10.x

ENV AWS_DEFAULT_REGION us-east-2

COPY . .

RUN npm install

RUN zip -9yr lambda.zip .

CMD serverless deploy
