import { handleCors, handleBodyRequestParsing, handleCompression, handleHelmet } from './common';

export default [handleCors, handleBodyRequestParsing, handleCompression, handleHelmet];
