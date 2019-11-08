var newStats = {
  lastUpdated: 0,
  users: {
    numberSignedUp: 0,
    numberVerified: 0,
    numberCompletedRegistration: 0,
    numberAdmitted: 0,
    numberCheckedin: 0,
    percentPreviouslyAttendedHackathons: 0
  },
  teams: {
    numberTeams: 0,
    numberUsersWithoutTeams: 0,
    numberTeamsOneUser: 0,
    averageTeamSize: 0
  },
  swag: {
    shirtSizes: {
      'XS': 0,
      'S': 0,
      'M': 0,
      'L': 0,
      'XL': 0,
      'XXL': 0,
      'WXS': 0,
      'WS': 0,
      'WM': 0,
      'WL': 0,
      'WXL': 0,
      'WXXL': 0,
      'None': 0
    }
  },
  hardware: {
    numberUsersRequestingFireeyeHardware: 0,
    numberUsersRequestingThirdpartyHardware: 0
  },
  software: {
    numberUsersRequestingFireeyeSoftware: 0,
    numberUsersRequestingThirdpartySoftware: 0
  },
  location: [
    {
      name: "",
      numberAttending: "",
      shirtSizes: {
        'XS': 0,
        'S': 0,
        'M': 0,
        'L': 0,
        'XL': 0,
        'XXL': 0,
        'WXS': 0,
        'WS': 0,
        'WM': 0,
        'WL': 0,
        'WXL': 0,
        'WXXL': 0,
        'None': 0
      },
      numberFoodAllergies: 0,
      numberDietaryRestrictions: 0,
      numberNeedingHardware: 0,
      numberNeedingSoftware: 0
    }
  ]
};