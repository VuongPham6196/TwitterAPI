import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/User.schema'
import { hashPassword } from './crypto'
import { MediaType, TweetAudience, TweetType, UserVerifyStatus } from '~/constants/enums'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { CreateTweetRequestBody } from '~/models/requests/Tweet.request'
import databaseServices from '~/services/database.services'
import Follow from '~/models/schemas/Follow.schema'
import tweetServices from '~/services/tweet.services'

const PASSWORD = 'Phamvuong@96'
const MYID = new ObjectId('6588470c654566ad06fceaee')
const USER_COUNT = 100

export function createRandomUser() {
  const user: RegisterReqBody = {
    username: faker.internet.displayName(),
    password: PASSWORD,
    confirm_password: PASSWORD,
    email: faker.internet.email(),
    date_of_birth: faker.date.birthdate().toISOString(),
    name: faker.internet.displayName()
  }
  return user
}

export function createRandomTweet() {
  const tweet: CreateTweetRequestBody = {
    type: TweetType.Tweet,
    audience: TweetAudience.Everyone,
    content: faker.lorem.paragraph({ min: 10, max: 160 }),
    hashtags: [],
    medias: [
      {
        type: Math.random().toFixed() === '1' ? MediaType.Video : MediaType.Image,
        url:
          Math.random().toFixed() === '1'
            ? 'https://www.youtube.com/watch?v=xRL2BspFnOs&list=RDMMF9SiLkScImM&index=11'
            : 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fletsenhance.io%2F&psig=AOvVaw2ZFvKPsBcKzZOPqckKzTiv&ust=1710744186514000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCLjgufnY-oQDFQAAAAAdAAAAABAE'
      }
    ],
    mentions: [],
    parent_id: null
  }
  return tweet
}

export const USERS: RegisterReqBody[] = faker.helpers.multiple(createRandomUser, {
  count: USER_COUNT
})

const insetMultipleUsers = async () => {
  console.log('start users')
  const users = USERS.map((item) => {
    const _id = new ObjectId()
    return new User({
      ...item,
      _id: _id,
      date_of_birth: new Date(item.date_of_birth),
      password: hashPassword(item.password),
      verify: UserVerifyStatus.Verified
    })
  })
  await databaseServices.users.insertMany(users)
  console.log('created users')
  return users.map((item) => item._id as ObjectId)
}

const followMultipleUsers = async (user_id: ObjectId, followed_user_ids: ObjectId[]) => {
  console.log('start follow')
  const follows = followed_user_ids.map((item) => {
    return new Follow({
      user_id: user_id,
      followed_user_id: item
    })
  })
  await databaseServices.follows.insertMany(follows)
  console.log('follow done')
}

const insetMultipleTweets = async (ids: ObjectId[]) => {
  console.log('start tweets')
  await Promise.all(
    ids
      .map((id) => {
        return [
          tweetServices.createTweet(id.toString(), createRandomTweet()),
          tweetServices.createTweet(id.toString(), createRandomTweet())
        ]
      })
      .flat(1)
  )
  console.log('created tweets')
}

insetMultipleUsers().then((ids) => {
  followMultipleUsers(MYID, ids)
  insetMultipleTweets(ids)
})
